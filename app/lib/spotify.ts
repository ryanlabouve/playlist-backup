import type { Playlist, Track, PlaylistMeta } from "~/types/all";
async function lookupUser(accessToken: string) {
  let repsonse: Response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  let json = await repsonse.json();
  return json;
}
async function lookupPlaylists(
  accessToken: string
): Promise<[Error | null, Playlist[] | null]> {
  let response: Response = await fetch(
    `https://api.spotify.com/v1/me/playlists?limit=50`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.status === 401) {
    return [new Error(`${response.status}`), null];
  }

  let json = await response.json();
  let items = json.items;
  //@ts-ignore
  items = items.map((p) => p.track);

  return [null, json.items];
}

async function lookupTracks(
  accessToken: string,
  playlistId: string,
  offset2?: number
): Promise<[Track[], PlaylistMeta]> {
  offset2 = offset2 || 0;

  // https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlists-tracks
  let response: Response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50&offset=${offset2}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  let json = await response.json();

  let { offset, previous, next, limit, href, total } = json;

  return [
    // @ts-ignore
    json.items.map((i) => i.track),
    {
      offset,
      previous,
      next,
      limit,
      href,
      total,
    },
  ];
}

function lookupSamplePlaylists(accessToken: string): Playlist[] {
  // @ts-ignore
  return samplePlaylists.items;
}

/**
 *
 * @param uri https://open.spotify.com/playlist/34xwiVguSZKYwBOK1WdZD5?si=ecdcd608a7ee4265
 * @returns Playlist[]
 */
async function getPlaylistByUri(
  accessToken: string,
  uri: string
): Promise<[Error | null, Playlist | null, Tracks[] | null]> {
  let playlistId: string | undefined = uri?.split("/").at(-1);
  playlistId = playlistId?.split("?").at(0);
  let response: Response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}?limit=50`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.status === 401) {
    return [new Error(`${response.status}`), null, null];
  }

  let json = await response.json();
  let items = json?.tracks?.items;
  //@ts-ignore
  let tracks: Track[] = items.map((p) => p.track);

  return [
    null,
    {
      href: json.href,
      id: json.id,
      images: json.images,
      name: json.name,
    },
    tracks,
  ];
}

/**
 * Terrible function that stiches an arbitrary amount of track JSON into
 * one bigish blob
 *
 * @param accessToken
 * @param playlistId
 */
async function prepareBackup(
  accessToken: string,
  initialTracks: Track[],
  selectedPlaylist: Playlist,
  selectedPlaylistMeta: PlaylistMeta
): Promise<any> {
  let tracks: Track[] = initialTracks || [];

  if (selectedPlaylistMeta.next) {
    let currentOffset =
      selectedPlaylistMeta.offset + selectedPlaylistMeta.limit;
    let stillFetchingTracks = true;

    while (stillFetchingTracks) {
      let [newTracks, newMeta] = await lookupTracks(
        accessToken,
        selectedPlaylist.id,
        currentOffset
      );

      // https://open.spotify.com/playlist/34xwiVguSZKYwBOK1WdZD5?si=ecdcd608a7ee4265

      stillFetchingTracks = !!newMeta.next;
      tracks = [...tracks, ...newTracks];
      currentOffset = newMeta.offset + newMeta.limit;
    }
  }

  return {
    playlist: {
      ...selectedPlaylist,
      ...selectedPlaylistMeta,
    },
    tracks,
  };
}

export {
  lookupUser,
  lookupPlaylists,
  lookupSamplePlaylists,
  lookupTracks,
  getPlaylistByUri,
  prepareBackup,
};
