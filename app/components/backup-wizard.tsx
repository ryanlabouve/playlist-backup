import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "~/contexts/user-context";
import samplePlaylists from "~/utils/sample-playlists";
import type { Playlist, Track } from "~/types/all";
import PlaylistSelector from "./playlist-selector";

async function lookupUser(accessToken: string) {
  let repsonse: Response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  let json = await repsonse.json();
  return json;
}
async function lookupPlaylists(accessToken: string): Promise<Playlist[]> {
  let response: Response = await fetch(
    `https://api.spotify.com/v1/me/playlists?limit=50`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  let json = await response.json();
  let items = json.items;
  items = items.map((p) => p.track);

  return json.items;
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
  return json.items.map((i) => i.track);
}

function lookupSamplePlaylists(accessToken: string): Playlist[] {
  // @ts-ignore
  return samplePlaylists.items;
}

export default function BackupWizard() {
  const { user } = useContext(UserContext);
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState<Track[]>(
    []
  );
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>();

  useEffect(() => {
    if (!user.accessToken) {
      return;
    }

    setPlaylists(lookupSamplePlaylists(user.accessToken));
  }, [user.accessToken]);

  useEffect(() => {
    if (!user.accessToken || !selectedPlaylist) {
      return;
    }
    lookupTracks(user.accessToken, selectedPlaylist.id).then((t: Track[]) =>
      setSelectedPlaylistTracks(t)
    );
  }, [selectedPlaylist]);

  return (
    <div className="flex p-12">
      <div className="p-3 panel-bg">
        <div className="text-center uppercase indent-text flex justify-center align-middle items-center">
          <svg
            width="150"
            height="6"
            viewBox="0 0 150 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="3" width="150" height="3" fill="#CEBB77" />
            <rect width="150" height="3" fill="#9F915C" />
          </svg>
          <div className="mx-4">Spotify Backup</div>
          <svg
            width="150"
            height="6"
            viewBox="0 0 150 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="3" width="150" height="3" fill="#CEBB77" />
            <rect width="150" height="3" fill="#9F915C" />
          </svg>
        </div>
        <div className="flex  items-center align-middle">
          <div>
            <div className="dark-boubble">999</div>Boop
          </div>
          <button className="btn my-2">
            <div className="bobble"></div> Logout
          </button>
        </div>
        <div className="bg-gray-900 p-0.5">
          <div className="p-3 panel-bg">
            <div className="panel-bg-dark p-3">
              {playlists.map((playlist: Playlist) => (
                <div key={playlist.id}>
                  <PlaylistSelector
                    playlist={playlist}
                    // @ts-ignore
                    selectPlaylist={(p) => setSelectedPlaylist(p)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 panel-bg border-l-gray-900 border-l-2 w-96">
        <div className="text-center pb-2 uppercase">
          {selectedPlaylist ? selectedPlaylist.name : "Select a playlist"}
        </div>

        <div className="bg-gray-900 p-0.5">
          <div className="p-3 panel-bg">
            <div className="panel-bg-dark p-3">
              {selectedPlaylist && (
                <div>
                  <div>Viewing playlist {selectedPlaylist.name}</div>
                  {selectedPlaylistTracks.map((t: Track) => {
                    return <div key={t.uri}>-{t.name}</div>;
                  })}
                </div>
              )}

              <div>{!selectedPlaylist && <div>No playlist loaded</div>}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
