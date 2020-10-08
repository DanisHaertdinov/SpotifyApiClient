import {SETTINGS} from './const';
import {render} from './util/render';
import AuthorizationView from './views/authorization';
import PlaylistsView from './views/playlists';
import PlaylistView from './views/playlist';

const generateAuthorizationLink = () => {
  return `https://accounts.spotify.com/authorize?client_id=${SETTINGS.CLIENT_ID}&redirect_uri=${SETTINGS.APP_URL}&scope=user-read-private%20user-read-email&response_type=token&state=123`;
};

const siteMainElement = document.querySelector(`.main`);

const hash = window.location.hash;

const playlistMock = {
  description: `My take on the TV Show with the best songs from Season 1, 2, 3 and personal picks | ダーク | 闇 Serie`,
  imageUrl: `https://i.scdn.co/image/ab67706c0000bebb7ee83f0ef57eaff6d1d3b7b1`,
  title: `Dark 1, 2, 3 Soundtrack (Netflix)`,
  tracksCount: 42,
};

switch (true) {
  case (hash.includes(`access_token`)):
    const playlistsElement = new PlaylistsView();

    render(siteMainElement, playlistsElement);
    new Array(10).fill(``)
    .forEach(
        () => render(playlistsElement, new PlaylistView(playlistMock))
    );
    break;
  case (hash.includes(`error`)):
    document.querySelector(`body`).textContent = `ERROR`;
    break;
  default:
    const authorizationLink = generateAuthorizationLink();
    render(siteMainElement, new AuthorizationView(authorizationLink));
    break;
}
