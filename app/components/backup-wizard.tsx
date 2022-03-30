import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "~/contexts/user-context";
import type { Playlist, PlaylistMeta, Track } from "~/types/all";
import PlaylistSelector from "./playlist-selector";

import {
  lookupPlaylists,
  lookupTracks,
  getPlaylistByUri,
  prepareBackup,
} from "~/lib/spotify";
import Bars from "./bars";

async function downloadBackup(name: string, blob: any) {
  let a = document.createElement("a");
  let file = new Blob([blob], { type: "text/json" });
  a.href = URL.createObjectURL(file);
  a.download = `${name}.spotify.bak.json`;
  a.click();
}

export default function BackupWizard() {
  const { user, logout } = useContext(UserContext);
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState<Track[]>(
    []
  );
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>();
  const [selectedPlaylistMeta, setSelectedPlaylistMeta] =
    useState<PlaylistMeta>();
  const [playlistUri, setPlaylistUri] = useState<string>("");
  const [playlistBackupBlob, setPlaylistBackupBlob] = useState<string>("");

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
    lookupTracks(user.accessToken, selectedPlaylist.id).then(
      ([ts, m]: [Track[], PlaylistMeta]) => {
        setSelectedPlaylistTracks(ts);
        setSelectedPlaylistMeta(m);
      }
    );
  }, [selectedPlaylist]);

  console.log(playlistBackupBlob);

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
        <div className="bg-gray-900 p-0.5 mb-3">
          <div className="p-3 panel-bg">
            <div className="panel-bg-dark p-3">
              {playlists.map((playlist: Playlist) => (
                <div key={playlist.id}>
                  <PlaylistSelector
                    playlist={playlist}
                    // @ts-ignore
                    selectPlaylist={(p) => {
                      setSelectedPlaylist(p);
                      setPlaylistBackupBlob("");
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-900 p-0.5 mb-3 ">
          <div className="p-3 panel-bg">
            <div className="flex justify-center align-middle items-center mb-2">
              <div className="flex-grow">Lookup By Address / ID</div>
              <button
                className="btn "
                onClick={async () => {
                  if (!user?.accessToken) {
                    return;
                  }
                  let [e, playlist, tracks] = await getPlaylistByUri(
                    user.accessToken,
                    playlistUri
                  );

                  if (playlist) {
                    setSelectedPlaylist(playlist);
                  }
                }}
              >
                <div className="bobble"></div> Lookup
              </button>
            </div>
            <div className="panel-bg-dark p-3">
              <input
                value={playlistUri}
                onChange={(e) => setPlaylistUri(e.target.value)}
                type="text"
                className="w-full bg-transparent order-transparent focus:border-transparent focus:ring-0"
              />
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
              {selectedPlaylistMeta?.total ? selectedPlaylistMeta.total : "000"}
            </div>{" "}
            Songs
          </div>
          <div className="flex-grow"></div>
          <button
            onClick={async () => {
              if (
                !user?.accessToken ||
                !selectedPlaylist ||
                !selectedPlaylistMeta
              )
                return;
              let blob = await prepareBackup(
                user?.accessToken,
                selectedPlaylistTracks,
                selectedPlaylist,
                selectedPlaylistMeta
              );

              setPlaylistBackupBlob(JSON.stringify(blob));
            }}
            className="btn my-2"
          >
            Prepare Backup
          </button>
          {playlistBackupBlob && (
            <button
              onClick={() => {
                if (!selectedPlaylist || !playlistBackupBlob) return;
                downloadBackup(selectedPlaylist.name, playlistBackupBlob);
              }}
              className="btn my-2"
            >
              Download Backup
            </button>
          )}
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
