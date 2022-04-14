import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { positions, Provider } from "react-alert";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import Login from "./Login/Login";
import NotFound from "./Not-Found/Not-Found";
import Home from "./Home/Home";
import RecoveryPassword from "./Recovery-Password/Recovery-Password";
import { UserContext, UserProvider, useUserContext } from "./UserContext";

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
};

const PrivateRoute = ({ element }) => {
  const { isLogin } = useUserContext();

  if (!isLogin) return <Navigate to="/" replace />;
  return <> {element} </>;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route
            exact
            path="/home"
            element={<PrivateRoute element={<Home />} />}
          />
          <Route
            exact
            path="/recovery-password"
            element={<RecoveryPassword />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
