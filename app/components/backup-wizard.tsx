import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "~/contexts/user-context";
import type { Playlist, Track } from "~/types/all";
import PlaylistSelector from "./playlist-selector";

import { lookupPlaylists, lookupTracks } from "~/lib/spotify";
import Bars from "./bars";

export default function BackupWizard() {
  const { user, logout } = useContext(UserContext);
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState<Track[]>(
    []
  );
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>();

  useEffect(() => {
    if (!user || !user.accessToken) {
      return;
    }

    lookupPlaylists(user.accessToken).then(
      ([e, pls]: [null | Error, Playlist[]]) => {
        if (e !== null) {
          logout();
          return;
        }
        pls && setPlaylists(pls);
      }
    );
  }, [user]);

  useEffect(() => {
    if (!user?.accessToken || !selectedPlaylist) {
      return;
    }
    lookupTracks(user.accessToken, selectedPlaylist.id).then((t: Track[]) =>
      setSelectedPlaylistTracks(t)
    );
  }, [selectedPlaylist]);

  return (
    <div className="flex p-12 m-auto max-w-5xl w-full">
      <div className="p-3 panel-bg">
        <div className="text-center uppercase indent-text flex justify-center align-middle items-center">
          <Bars />
          <div className="mx-4">Spotify Backup</div>
          <Bars />
        </div>
        <div className="flex  items-center align-middle">
          <div>
            <div className="dark-boubble">
              {playlists?.length ? playlists.length : "000"}
            </div>{" "}
            Playlists
          </div>
          <div className="flex-grow"></div>
          <button className="btn my-2" onClick={() => logout()}>
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
        <div className="text-center  uppercase">
          {selectedPlaylist
            ? `Viewing ${selectedPlaylist.name}`
            : "Select a playlist"}
        </div>
        <div className="flex  items-center align-middle">
          <div>
            <div className="dark-boubble">
              {selectedPlaylistTracks?.length
                ? selectedPlaylistTracks.length
                : "000"}
            </div>{" "}
            Songs
          </div>
          <div className="flex-grow"></div>
          <button className="btn my-2">Prepare Backup</button>
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
