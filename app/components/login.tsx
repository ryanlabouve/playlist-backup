import Bars from "./bars";

const data = {
  SPOTIFY_CLIENT_ID: "ee8edd6ba4a5435fa54e39e57d38cd17",
  SPOTIFY_AUTH_ENDPOINT: "https://accounts.spotify.com/authorize",
  SPOTIFY_REDIRECT_URI: "http://localhost:3000",
  SPOTIFY_RESPONSE_TYPE: "token",
};
export default function Login() {
  return (
    <div className="" style={{ width: 320, margin: " 128px auto" }}>
      <div className="p-3 panel-bg">
        <div className="text-center uppercase indent-text flex justify-center align-middle items-center mb-2">
          <Bars />
          <div className="mx-4">Spotify.Bak</div>
          <Bars />
        </div>
        <div className="mb-2">
          <p>A way to backup your favorite Spotify platlist.</p>
        </div>
        <div className="">
          <a
            className="btn"
            href={`${data.SPOTIFY_AUTH_ENDPOINT}?client_id=${data.SPOTIFY_CLIENT_ID}&redirect_uri=${data.SPOTIFY_REDIRECT_URI}&response_type=${data.SPOTIFY_RESPONSE_TYPE}`}
          >
            <div className="bobble"></div> Logout Login to Spotify
          </a>
        </div>
      </div>
    </div>
  );
}
