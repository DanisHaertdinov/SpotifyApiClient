export default class Playlist {

  static adaptToClient(playlist) {
    console.log(playlist);
    return {
      description: playlist.description,
      imageUrl: playlist.images[0].url,
      title: playlist.name,
      tracksCount: playlist.tracks.total,
    };
  }
}
