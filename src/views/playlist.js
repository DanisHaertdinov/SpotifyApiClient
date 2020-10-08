import Abstract from './abstract';

const createPlaylistTemplate = (playlist) => {
  const {imageUrl, title, description, tracksCount} = playlist;
  return (
    `<div class="playlist">
      <img class="playlist__image" alt="" src="${imageUrl}">
      <h3 class="playlist__title">${title}</h3>
      <p class="playlist__description">${description}</p>
      <p class="playlist__tracks-count">${tracksCount} tracks inside</p>
  </div>`
  );
};

export default class Playlist extends Abstract {
  constructor(playlist) {
    super();

    this._playlist = playlist;
  }

  getTemplate() {
    return createPlaylistTemplate(this._playlist);
  }
}
