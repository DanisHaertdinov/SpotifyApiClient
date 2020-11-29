const Method = {
  GET: `GET`,
  DELETE: `DELETE`,
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getUserProfile() {
    return this._load({url: `me`})
      .then(Api.toJSON);
  }

  getUserPlaylists() {
    return this._load({url: `me/playlists`})
      .then(Api.toJSON);
  }

  getPlaylistTracks(playlistId) {
    return this._load({url: `playlists/${playlistId}/tracks`})
      .then(Api.toJSON);
  }

  deleteTrackFromPlaylist(trackUri, playlistId) {
    return this._load({
      url: `playlists/${playlistId}/tracks`,
      method: Method.DELETE,
      body: JSON.stringify({tracks: [{uri: trackUri}]}),
    })
    .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
    }
    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
