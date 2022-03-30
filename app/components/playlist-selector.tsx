import type { Playlist, Track } from "~/types/all";
interface Props {
  playlist: Playlist;
  selectPlaylist: Function;
}
export default function ShowPlaylist({ playlist, selectPlaylist }: Props) {
  return (
    <div
      className="mb-2 flex playlist-row"
      onClick={() => selectPlaylist(playlist)}
    >
      <div className="mr-3">{playlist.name}</div>
      <button className="  text-xs" onClick={() => selectPlaylist(playlist)}>
        ⇢
      </button>
    </div>
  );
}
