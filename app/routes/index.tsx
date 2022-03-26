import { json, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { json } from "remix";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "~/contexts/user-context";
import BackupWizard from "~/components/backup-wizard";

export const loader: LoaderFunction = async () => {
  // TODO: get session for token instead of localstorage
  // https://remix.run/docs/en/v1/api/remix#using-sessions
  return json({
    SPOTIFY_AUTH_ENDPOINT: process.env.SPOTIFY_AUTH_ENDPOINT,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
    SPOTIFY_RESPONSE_TYPE: process.env.SPOTIFY_RESPONSE_TYPE,
  });
};

export default function Index() {
  const data = useLoaderData();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const hash: string = window?.location?.hash || "";
    let token: string = window.localStorage.getItem("token")
      ? `${window.localStorage.getItem("token")}`
      : "";

    if (!token && hash) {
      // @ts-ignore
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setUser({
      accessToken: token,
    });
  }, [user.accessToken]);

  return (
    <div>
      {!user.accessToken && (
        <a
          href={`${data.SPOTIFY_AUTH_ENDPOINT}?client_id=${data.SPOTIFY_CLIENT_ID}&redirect_uri=${data.SPOTIFY_REDIRECT_URI}&response_type=${data.SPOTIFY_RESPONSE_TYPE}`}
        >
          Login to Spotify
        </a>
      )}
      {user.accessToken && <BackupWizard />}
    </div>
  );
}
