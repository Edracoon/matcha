import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Auth from "./Auth/Auth";
import NotFound from "./Not-Found/Not-Found";
import Home from "./Home/Home";
import RecoveryPassword from "./Recovery-Password/Recovery-Password";
import RegisterConfirm from "./RegisterConfirm/RegisterConfirm";

import Loading from "./Loading/Loading";
import { UserProvider, useUserContext } from "./UserContext";

import ImageHandler from "./UserProfile/ImageHandler";

const UnprivateRoute = ({ element }) => {
  const { verifyJwt } = useUserContext();
  const [isLogged, setLogged] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    if (!isLogged) {
      verifyJwt().then((res) => {
        if (mounted) setLogged(!res);
        if (res) navigate("/home", { replace: true });
      });
    }
    return () => (mounted = false);
  });
  if (isLogged === null) return <Loading />;
  return isLogged ? <> {element} </> : false;
};

const PrivateRoute = ({ element }) => {
  const { verifyJwt } = useUserContext();
  const [isLogged, setLogged] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    if (!isLogged) {
      verifyJwt().then((res) => {
        if (mounted) setLogged(res);
        if (!res) navigate("/", { replace: true });
      });
    }
    return () => (mounted = false);
  });
  if (isLogged === null) return <Loading />;
  return isLogged ? <> {element} </> : false;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={<UnprivateRoute element={<Auth />} />}
          />
          <Route
            exact
            path="/home"
            element={<PrivateRoute element={<Home />} />}
          />
          <Route
            exact
            path="/register-confirm"
            element={<UnprivateRoute element={<RegisterConfirm />} />}
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
