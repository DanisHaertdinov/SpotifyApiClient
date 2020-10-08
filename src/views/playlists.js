import Abstract from './abstract';

const createPlaylistsTemplate = () => {
  return (
    `<div class="playlists"></div>`
  );
};

export default class Playlists extends Abstract {


  getTemplate() {
    return createPlaylistsTemplate();
  }
}
