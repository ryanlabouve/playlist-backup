import { createContext } from "react";
import type { User } from "~/types/all";

interface UserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User>> | Function;
  logout: Function;
}
export const UserContext = createContext<UserContext>({
  user: {},
  setUser: () => {
    throw "Implement me #setUser";
  },
  logout: () => {
    throw "Implement me #logout";
  },
});
