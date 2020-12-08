import Playlist from "../models/playlist";
import Track from "../models/track";

//
// 1. Построить 2-3 осмысленных цепочек запросов - это должно выглядеть, как часть бизнес-логики. Например:
// клонируем плейлист
// 1 получить данные о плейлисте
// 2 достать трэки из плейлиста
// 3 создать новый плейлист с данными оригинала
// 4 загрузить трэки из оргинального плейлиста в новый
const clonePlaylist = (playlistId, api) => {
  let originalPlaylist = {};

  return api.getPlaylist(playlistId)
    .then((playlist) => {
      originalPlaylist = Playlist.adaptToClient(playlist);

      return getAllPlaylistTracks(originalPlaylist, api);
    })
    .then((responses) => {
      const tracks = [];

      responses.forEach((response) => {
        const tracksGroup = response.items.map((track) => Track.adaptToClient(track).uri);
        tracks.push(tracksGroup);
      });
      originalPlaylist = Object.assign(originalPlaylist, {tracks});

      return api.createPlaylist(`31tfipwn47j5udp5pl2ftcjx7nou`, {
        name: originalPlaylist.title,
        description: originalPlaylist.description
      });
    })
    .then((newPlaylist) => {
      const adaptedPlaylist = Playlist.adaptToClient(newPlaylist);
      const newPlaylistId = adaptedPlaylist.id;

      const requests = originalPlaylist.tracks.map((tracksGroup) => {
        return api.addTracksToPlaylist(tracksGroup, newPlaylistId);
      });

      return Promise.all(requests);
    });
};


const getAllPlaylistTracks = (playlist, api) => {
  const TRACKS_LIMIT_BY_REQUEST = 100;
  const tracksCount = playlist.tracksCount;
  const requestsCount = Math.ceil(tracksCount / TRACKS_LIMIT_BY_REQUEST);

  const requests = new Array(requestsCount).fill(``).map((item, i) => {
    const requestsCounter = i * TRACKS_LIMIT_BY_REQUEST;

    return api.getPlaylistTracks(playlist.id, TRACKS_LIMIT_BY_REQUEST, requestsCounter);
  });

  return Promise.all(requests);
};

const createPlaylistWithUserTopTracks = (api) => {
  let tracks = [];

  return api.getUserTopTracks()
    .then((response) =>{
      tracks = response.items.map((track) => track.uri);

      return api.createPlaylist(`31tfipwn47j5udp5pl2ftcjx7nou`, {});
    })
    .then((newPlaylist) => {
      const adaptedPlaylist = Playlist.adaptToClient(newPlaylist);
      const newPlaylistId = adaptedPlaylist.id;

      return api.addTracksToPlaylist(tracks, newPlaylistId);
    });
};

// Написать функцию wait

const wait = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// Собрать промисы в массив и выполнить их параллельно
// Массив содержит минимум пять запросов

const getPlaylistsInParallel = (api) => {
  const PLAYLISTS_IDS = [
    `76pmyfRjiEh0OdbhOl5xiW`, `4lGngVWb504apEiBcp5ur8`, `0sJOog5Q0RPLnh78I3yO7n`, `0NQjxHauN7XqzZF1jbRJdp`, `4nlTEyHMt44zT8EpfAeaVW`
  ];

  const requests = PLAYLISTS_IDS.map((id) => api.getPlaylist(id));

  return Promise.all(requests);
};

// Собрать промисы в массив и разрезолвить его, когда выполнится первый
// Массив содержит минимум пять запросов

const getPlaylistsInRace = (api) => {
  const PLAYLISTS_IDS = [
    `76pmyfRjiEh0OdbhOl5xiW`, `4lGngVWb504apEiBcp5ur8`, `0sJOog5Q0RPLnh78I3yO7n`, `0NQjxHauN7XqzZF1jbRJdp`, `4nlTEyHMt44zT8EpfAeaVW`
  ];

  const requests = PLAYLISTS_IDS.map((id) => api.getPlaylist(id));

  return Promise.race(requests);
};

// Собрать промисы в массив и выполнить их последовательно
// Массив содержит минимум пять запросов

const getPlaylistsConsistently = (api) => {
  const PLAYLISTS_IDS = [
    `76pmyfRjiEh0OdbhOl5xiW`, `4lGngVWb504apEiBcp5ur8`, `0sJOog5Q0RPLnh78I3yO7n`, `0NQjxHauN7XqzZF1jbRJdp`, `4nlTEyHMt44zT8EpfAeaVW`
  ];

  let count = 0;
  const responses = [];

  const iterator = (resolve) => {
    if (PLAYLISTS_IDS[count]) {

      return api.getPlaylist(PLAYLISTS_IDS[count])
        .then((response) => {
          responses.push(response);
          count += 1;
          iterator(resolve);
        });
    }
    resolve(responses);

    return ``;
  };

  return new Promise((resolve) => iterator(resolve));
};

export {clonePlaylist, wait, getPlaylistsInParallel, getPlaylistsInRace, getPlaylistsConsistently, createPlaylistWithUserTopTracks};
