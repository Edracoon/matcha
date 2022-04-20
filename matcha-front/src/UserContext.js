import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const verifyJwt = async () => {
    const ret = await fetch("http://localhost:3000/api/auth/jwt", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ token: localStorage.getItem("access_token") }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("verifyJwt -> ", json);
        if (json.response === false) {
          localStorage.clear();
          return false;
        } else {
          return true;
        }
      });
    return ret;
  };

  return {
    ...context,
    logout,
    verifyJwt,
  };
};

export const UserProvider = (props) => {
  const [isLogin, setLogin] = useState(false);

  const defaultValue = { isLogin, setLogin };

  return (
    <UserContext.Provider value={defaultValue}>
      {props.children}
    </UserContext.Provider>
  );
};
