export default class Track {

  static adaptToClient(track) {
    return {
      title: track[`id`],
      album: track[`album`][`name`],
      duration: track[`duration_ms`],
    };
  }
}
