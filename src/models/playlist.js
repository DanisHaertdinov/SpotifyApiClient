export default class Playlist {

  static adaptToClient(playlist) {
    return {
      id: playlist[`id`],
      description: playlist[`description`],
      imageUrl: (playlist[`images`][0] ? playlist[`images`][0][`url`] : ``),
      title: playlist[`name`],
      tracksCount: playlist[`tracks`][`total`],
      owner: {
        author: playlist[`owner`][`display_name`],
        id: playlist[`owner`][`id`]
      },
    };
  }
}
