import { createContext, useContext, useDebugValue, useState } from "react";
import useLocalStorage from "./useLocalStorage";

export const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);

  const logout = () => {
    context.setLogin(false);
    context.setJwt(null);
  };

  return {
    ...context,
    logout,
  };
};

export const UserProvider = (props) => {
  const [isLogin, setLogin] = useState(false);
  const [jwt, setJwt] = useLocalStorage("session_token", null);

  useDebugValue(isLogin, (value) => (value ? "connecté" : "pas connecté"));

  const defaultValue = { isLogin, setLogin, jwt, setJwt };

  return (
    <UserContext.Provider value={defaultValue}>
      {props.children}
    </UserContext.Provider>
  );
};
