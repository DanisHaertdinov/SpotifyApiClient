import Abstract from './abstract';

const createPlaylistModalTracksTemplate = (tracks) => {
  return tracks.map((track) => {
    const {title, album, duration} = track;

    return (
      `<tr class="playlist-details__track track">
        <td>${title}</td>
        <td>${album}</td>
        <td>${duration}</td>
        <td><button>X</button></td>
      </tr>`
    );
  }).join(``);
};

const createPlaylistModalTemplate = (playlist, tracks) => {
  const {imageUrl, title, description, tracksCount, owner} = playlist;
  const {author} = owner;
  return (
    `<div class="playlist-details">
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
            <th></th>
          </tr>
          ${createPlaylistModalTracksTemplate(tracks)}
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
  }

  getTemplate() {
    return createPlaylistModalTemplate(this._playlist, this._tracks);
  }
}
