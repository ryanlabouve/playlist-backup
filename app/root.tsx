import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";

import type { MetaFunction } from "remix";
import { UserContext } from "./contexts/user-context";
import { useState, useEffect } from "react";
import type { User } from "~/types/all";

export const meta: MetaFunction = () => {
  return { title: "Spotify.Bak | Backup your favorite spotify playlist" };
};

import styles from "./styles/app.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

function clearUserFromLocalStorage() {
  // TODO: Move to Cookie
  window.localStorage.setItem("token", "");
}

export default function App() {
  const [user, setUser] = useState<User>({});
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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <UserContext.Provider
          value={{
            user,
            setUser,
            logout: () => {
              clearUserFromLocalStorage();
              setUser({});
            },
          }}
        >
          <Outlet />
        </UserContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
