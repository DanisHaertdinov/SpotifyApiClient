import Playlist from "../models/playlist";
import Track from "../models/track";

const clonePlaylist = async (playlistId, api) => {
  const originalPlaylistResponse = await api.getPlaylist(playlistId);
  const originalPlaylist = Playlist.adaptToClient(originalPlaylistResponse);

  const tracks = await getAllPlaylistTracks(originalPlaylist, api);

  const newPlaylistResponse = await api.createPlaylist(`31tfipwn47j5udp5pl2ftcjx7nou`, {
    name: originalPlaylist.title,
    description: originalPlaylist.description
  });
  const newPlaylist = Playlist.adaptToClient(newPlaylistResponse);

  return Promise.all(
      tracks.map((tracksGroup) => {
        return api.addTracksToPlaylist(tracksGroup, newPlaylist.id);
      })
  );
};

const getAllPlaylistTracks = async (playlist, api) => {
  const TRACKS_LIMIT_BY_REQUEST = 100;
  const tracksCount = playlist.tracksCount;
  const requestsCount = Math.ceil(tracksCount / TRACKS_LIMIT_BY_REQUEST);

  const tracksResponses = await Promise.all(
      new Array(requestsCount).fill(``).map((item, i) => {
        const requestsCounter = i * TRACKS_LIMIT_BY_REQUEST;
        return api.getPlaylistTracks(playlist.id, TRACKS_LIMIT_BY_REQUEST, requestsCounter);
      })
  );

  return tracksResponses.map((response) => response.items.map((track) => Track.adaptToClient(track).uri));
};

const createPlaylistWithUserTopTracks = async (api) => {
  const tracksResponse = await api.getUserTopTracks();
  const tracks = tracksResponse.items.map((track) => track.uri);

  const newPlaylistResponse = await api.createPlaylist(`31tfipwn47j5udp5pl2ftcjx7nou`, {});
  const newPlaylist = Playlist.adaptToClient(newPlaylistResponse);

  return api.addTracksToPlaylist(tracks, newPlaylist.id);
};

const getPlaylistsConsistently = async (api) => {
  const PLAYLISTS_IDS = [
    `76pmyfRjiEh0OdbhOl5xiW`, `4lGngVWb504apEiBcp5ur8`, `0sJOog5Q0RPLnh78I3yO7n`, `0NQjxHauN7XqzZF1jbRJdp`, `4nlTEyHMt44zT8EpfAeaVW`
  ];
  let requests = [];

  for (const id of PLAYLISTS_IDS) {
    const request = await api.getPlaylist(id);
    requests = [...requests, request];
  }

  return await Promise.all(
      requests
  );
};

export {clonePlaylist, createPlaylistWithUserTopTracks, getPlaylistsConsistently};
