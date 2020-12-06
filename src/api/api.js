const Method = {
  GET: `GET`,
  DELETE: `DELETE`,
  POST: `POST`,
  PUT: `PUT`
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

  getPlaylist(playlistId) {
    return this._load({url: `playlists/${playlistId}`})
      .then(Api.toJSON);
  }

  getPlaylistTracks(playlistId, limit = 100, offset = 0) {
    return this._load({url: `playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`})
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

  addTrackToPlaylist(trackUri, playlistId) {
    return this._load({
      url: `playlists/${playlistId}/tracks`,
      method: Method.POST,
      body: JSON.stringify({uris: [trackUri]}),
    })
    .then(Api.toJSON);
  }

  addTracksToPlaylist(tracksUris, playlistId) {
    return this._load({
      url: `playlists/${playlistId}/tracks`,
      method: Method.POST,
      body: JSON.stringify({uris: tracksUris}),
    })
      .then(Api.toJSON);
  }

  createPlaylist(userId, {
    name = `New Playlist`,
    description = `New playlist description`
  }) {
    return this._load({
      url: `users/${userId}/playlists`,
      method: Method.POST,
      body: JSON.stringify({name, description}),
    })
    .then(Api.toJSON);
  }

  changePlaylist(playlistId, {
    name,
    description,
    isPublic
  }) {
    return this._load({
      url: `playlists/${playlistId}`,
      method: Method.PUT,
      body: JSON.stringify({name, description, isPublic}),
    })
    .then(Api.toJSON);
  }

  getTrack(trackId) {
    return this._load({url: `tracks/${trackId}`})
      .then(Api.toJSON);
  }

  search(type, query) {
    return this._load({url: `search/?q=${query}&type=${type}`})
      .then(Api.toJSON);
  }

  followPlaylist(playlistId) {
    return this._load({
      url: `playlists/${playlistId}/followers`,
      method: Method.PUT,
    })
    .then(Api.toJSON);
  }

  unFollowPlaylist(playlistId) {
    return this._load({
      url: `playlists/${playlistId}/followers`,
      method: Method.DELETE,
    })
    .then(Api.toJSON);
  }

  getAlbum(albumId) {
    return this._load({url: `albums/${albumId}`})
      .then(Api.toJSON);
  }

  getArtist(artistId) {
    return this._load({url: `artists/${artistId}`})
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
