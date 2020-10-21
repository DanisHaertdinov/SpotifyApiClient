export default class Track {

  static adaptToClient(track) {
    return {
      title: track[`track`][`name`],
      album: track[`track`][`album`][`name`],
      duration: track[`track`][`duration_ms`],
    };
  }
}
