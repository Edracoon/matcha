import React from "react";
import ReactDOM from "react-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login/Login";
import Header from "./Header/Header";

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <Login />;
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
