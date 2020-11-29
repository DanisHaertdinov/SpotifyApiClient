import Abstract from './abstract';
import Api from '../api/api';

const createPlaylistModalTracksTemplate = (tracks, isUserPlaylist) => {
  return tracks.map((track) => {
    const {title, album, duration, uri, id} = track;

    return (
      `<tr data-id="${id}" class="playlist-details__track track">
        <td>${title}</td>
        <td>${album}</td>
        <td>${duration}</td>
        ${isUserPlaylist ? `<td><button data-id="${id}" data-uri="${uri}" class="track__delete">X</button></td>` : ``}
      </tr>`
    );
  }).join(``);
};

const createPlaylistModalTemplate = (playlist, tracks) => {
  const {imageUrl, title, description, tracksCount, owner, isUserPlaylist} = playlist;
  const {author} = owner;
  return (
    `<div class="playlist-details">
      <button class="playlist-details__close"><span class="visually-hidden">close</span></button>
      <div class="playlist-details__header">
        <img class="playlist-details__image" alt="" src="${imageUrl}" width="324" height="324">
        <div class="playlist-details__info">
          <h3 class="playlist-details__title">${title}</h3>
          <p class="playlist-details__description">${description}</p>
          <p class="playlist-details__author">${author}</p>
          <p class="playlist-details__tracks-count">${tracksCount} tracks</p>
        </div>
      </div>
      <div class="playlist-details__body">
        <table class="playlist-details__tracks">
          <tr>
            <th>Title</th>
            <th>Album</th>
            <th>Duration</th>
            ${isUserPlaylist ? `<th>Delete</th>` : `` }
          </tr>
          ${createPlaylistModalTracksTemplate(tracks, isUserPlaylist)}
        </table>
      </div>
  </div>`
  );
};

export default class PlaylistModal extends Abstract {
  constructor(playlist, tracks) {
    super();

    this._playlist = playlist;
    this._tracks = tracks;

    this._closeButtonClickHandler = (evt) => {
      evt.preventDefault();
      this._callback.closeButtonClick();
    };

    this._trackDeleteButtonClickHandler = (evt) => {
      if (evt.target.classList.contains(`track__delete`)) {
        const trackUri = evt.target.dataset[`uri`];
        const trackId = evt.target.dataset[`id`];

        evt.preventDefault();
        this._callback.trackDeleteButtonClick(trackUri)
        .then(Api.checkStatus)
        .then(() => {
          this._deleteTrack(trackId);
        });
      }
    };
  }

  _deleteTrack(id) {
    this.getElement().querySelector(`.track[data-id="${id}"]`).remove();
  }

  getTemplate() {
    return createPlaylistModalTemplate(this._playlist, this._tracks);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector(`.playlist-details__close`).addEventListener(`click`, this._closeButtonClickHandler);
  }

  setTrackDeleteButtonClickHandler(callback) {
    this._callback.trackDeleteButtonClick = callback;
    this.getElement().querySelectorAll(`.track`).forEach((element) => {
      element.addEventListener(`click`, this._trackDeleteButtonClickHandler);
    });
  }
}
