import api from "../api/api";
import Playlist from "../models/playlist";
import Track from "../models/track";

const PLAYLIST_ID = '1j2L3DjzZ3SdN64r83Sblj';

//
// 1. Построить 2-3 осмысленных цепочек запросов - это должно выглядеть, как часть бизнес-логики. Например:
// клонируем плейлист
// 1 получить данные о плейлисте
// 2 достать трэки из плейлиста
// 3 создать новый плейлист с данными оригинала
// 4 загрузить трэки из оргинального плейлиста в новый
const clonePlaylist = (playlistId) => {
  let originalPlaylist = {};
  api.getPlaylist(playlistId)
    .then((playlist) => {
      originalPlaylist = Playlist.adaptToClient(playlist);

      return getAllPlaylistTracks(originalPlaylist);
    })
    .then((responses) => {
      responses.forEach((response) => {
        const tracks = response.items.map((track) => Track.adaptToClient(track).uri);
        originalPlaylist.tracks.push(tracks);
      });

      return api.createPlaylist({
        name: originalPlaylist.title,
        description: originalPlaylist.description
      })
      .then((newPlaylist) => {
        const adaptedPlaylist = Playlist.adaptToClient(newPlaylist);
        const newPlaylistId = adaptedPlaylist.id;

        const requests = originalPlaylist.tracks.map((tracksGroup) => {
          api.addTracksToPlaylist(tracksGroup, newPlaylistId);
        });

        return Promise.all(requests);
      });
    });
};


const getAllPlaylistTracks = (playlist) => {
  const TRACKS_LIMIT_BY_REQUEST = 100;
  const tracksCount = playlist.tracksCount;
  const requestsCount = Math.ceil(tracksCount / TRACKS_LIMIT_BY_REQUEST);
  let requestsCounter = -1;

  const requests = new Array(requestsCount).fill(``).map(() => {
    requestsCounter += 1;
    return api.getPlaylistTracks(playlist.id, TRACKS_LIMIT_BY_REQUEST, requestsCounter);
  });

  return Promise.all(requests);
};

// Написать функцию wait

const wait = (delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(), delay));
};
