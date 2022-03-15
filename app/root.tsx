import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";

import { json, useLoaderData } from "remix";

import type { LoaderFunction } from "remix";

import type { MetaFunction } from "remix";
import { UserContext } from "./contexts/user-context";
import { useState } from "react";
import type { User } from "remix.env";

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export const loader: LoaderFunction = async () => {
  return json({
    SPOTIFY_AUTH_ENDPOINT: process.env.SPOTIFY_AUTH_ENDPOINT,
  });
};

export default function App() {
  const data = useLoaderData();
  const [user, setUser] = useState<User>({});
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <UserContext.Provider value={{ user, setUser }}>
          <Outlet />
        </UserContext.Provider>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
