import {EndPoints, SETTINGS} from './const';
import {render, remove} from './util/render';
import AuthorizationView from './views/authorization';
import PlaylistsView from './views/playlists';
import PlaylistView from './views/playlist';
import Api from './api/api';
import Playlist from './models/playlist';
import PlaylistModal from './views/playlist-modal';
import Track from './models/track';

const generateAuthorizationLink = () => {
  return `https://accounts.spotify.com/authorize?client_id=${SETTINGS.CLIENT_ID}&redirect_uri=${SETTINGS.APP_URL}&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-modify-private%20&response_type=token&state=123`;
};

const siteMainElement = document.querySelector(`.main`);

const hash = window.location.hash;

const showPlaylistModal = (playlist, api) => {
  api.getPlaylistTracks(playlist.id)
  .then((tracksData) => tracksData.items)
  .then((tracks) => tracks.map((track) => Track.adaptToClient(track)))
  .then((tracks) => {
    const playlistComponent = new PlaylistModal(playlist, tracks);
    document.body.appendChild(playlistComponent.getElement());
    playlistComponent.setCloseButtonClickHandler(() => {
      remove(playlistComponent);
    });

    playlistComponent.setTrackDeleteButtonClickHandler((trackUri) => {
      return api.deleteTrackFromPlaylist(trackUri, playlist.id);
    });
  });
};

switch (true) {
  case (hash.includes(`access_token`)):

    const token = `Bearer ${hash.split(`&`)[0].split(`=`)[1]}`;
    const api = new Api(EndPoints.SPOTIFY, token);
    api.getUserPlaylists()
    .then((playlistsData) => playlistsData.items)
    .then((playlists) => playlists.map((playlist) => Playlist.adaptToClient(playlist)))
    .then((playlists) => {
      const playlistsElement = new PlaylistsView();
      render(siteMainElement, playlistsElement);

      playlists.forEach(
          (playlist) => {
            const playlistComponent = new PlaylistView(playlist);
            playlistComponent.getElement().addEventListener(`click`, (evt) => {
              evt.preventDefault();
              showPlaylistModal(playlist, api);
            });
            render(playlistsElement, playlistComponent);
          }
      );
    });

    break;
  case (hash.includes(`error`)):
    document.querySelector(`body`).textContent = `ERROR`;
    break;
  default:
    const authorizationLink = generateAuthorizationLink();
    render(siteMainElement, new AuthorizationView(authorizationLink));
    break;
}
