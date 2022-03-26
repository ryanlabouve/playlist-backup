import { createContext } from "react";
import type { User } from "~/types/all";

interface UserContext {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>> | Function;
}
export const UserContext = createContext<UserContext>({
  user: {},
  setUser: () => {
    throw "Implement me";
  },
});
