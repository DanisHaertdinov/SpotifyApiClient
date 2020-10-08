import {SETTINGS} from './const';
import {render} from './util/render';
import AuthorizationView from './views/authorization';
import PlaylistsView from './views/playlists';
import PlaylistView from './views/playlist';

const generateAuthorizationLink = () => {
  return `https://accounts.spotify.com/authorize?client_id=${SETTINGS.CLIENT_ID}&redirect_uri=${SETTINGS.APP_URL}&scope=user-read-private%20user-read-email&response_type=token&state=123`;
};

const siteMainElement = document.querySelector(`.main`);

const authorizationLink = generateAuthorizationLink();

const hash = window.location.hash;

switch (true) {
  case (hash.includes(`access_token`)):
    document.querySelector(`body`).textContent = `SUCCESS`;
    break;
  case (hash.includes(`error`)):
    document.querySelector(`body`).textContent = `ERROR`;
    break;
  default:
    render(siteMainElement, new AuthorizationView(authorizationLink));
    break;
}
