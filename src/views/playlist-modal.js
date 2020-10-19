import Abstract from './abstract';

const createPlaylistModalTracksTemplate = (tracks) => {
  return tracks.map((track) => {
    const {title, album, duration} = track;

    return (
      `<tr>
        <td>${title}</td>
        <td>${album}</td>
        <td>${duration}</td>
        <td><button>X</button></td>
      </tr>`
    );
  }).join(``);
};

const createPlaylistModalTemplate = (playlist, tracks) => {
  const {imageUrl, title, description, tracksCount, author} = playlist;
  return (
    `<div class="playlist-details">
      <img class="playlist-details__image" alt="" src="${imageUrl}">
      <h3 class="playlist-details__title">${title}</h3>
      <p class="playlist-details__description">${description}</p>
      <p class="playlist-details__author">${author}</p>
      <p class="playlist-details__tracks-count">${tracksCount} tracks</p>
      <table>
        <tr>
          <th>title</th>
          <th>album<th>
          <th>duration</th>
          <th></th>
        </tr>
        ${createPlaylistModalTracksTemplate(tracks)}
      </table>
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
