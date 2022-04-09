import React from "react";
import ReactDOM from "react-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./Login/Login";
import Header from "./Header/Header";
import NotFound from "./Not-Found/Not-Found";
import Home from "./Home/Home";
import RecoveryPassword from "./Recovery-Password/Recovery-Password";
import Register from "./Register/Register";

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/register" element={<Register />} />
          <Route
            exact
            path="/recovery-password"
            element={<RecoveryPassword />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
