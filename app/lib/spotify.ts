import type { Playlist, Track } from "~/types/all";
async function lookupUser(accessToken: string) {
  let repsonse: Response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  debugger;
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
  playlistId: string
): Promise<Track[]> {
  // https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlists-tracks
  let response: Response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  let json = await response.json();
  //@ts-ignore
  return json.items.map((i) => i.track);
}

function lookupSamplePlaylists(accessToken: string): Playlist[] {
  // @ts-ignore
  return samplePlaylists.items;
}

export { lookupUser, lookupPlaylists, lookupSamplePlaylists, lookupTracks };
