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
  api.getPlaylist(playlistId)
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
      })
      .then((newPlaylist) => {
        const adaptedPlaylist = Playlist.adaptToClient(newPlaylist);
        const newPlaylistId = adaptedPlaylist.id;

        const requests = originalPlaylist.tracks.map((tracksGroup) => {
          return api.addTracksToPlaylist(tracksGroup, newPlaylistId);
        });
        return Promise.all(requests);
      });
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

// Написать функцию wait

const wait = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export {clonePlaylist};
