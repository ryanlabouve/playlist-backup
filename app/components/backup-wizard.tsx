import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "~/contexts/user-context";

// export const loaderFunction: LoaderFunction = async () => {
// curl --request GET \
//   --url  \
//   --header 'Authorization: ' \
//   --header 'Content-Type: application/json'
// const {data} = await axios.get("https://api.spotify.com/v1/search", {
//     headers: {
//         Authorization: `Bearer ${token}`
//     },
//     params: {
//         q: searchKey,
//         type: "artist"
//     }
// })

//   let request: Promise<Response> = await fetch(
//     "https://api.spotify.com/v1/me",
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
//   return json({ any: "thing" });
// };

export default function BackupWizard() {
  const { user } = useContext(UserContext);
  console.log(user);
  return <div>See your playlists</div>;
}
