import React from "react";
import "./Login.css";

export default class Login extends React.Component {
  constructor() {
    super();
  }

  render(props) {
    return (
      <div className="d-flex align-items-center flex-column justify-content-between">
        <h1 className="title-matcha">matcha</h1>
        <div className="gap">
          <button className="button">Login</button>
        </div>
        <div className="gap">
          <button className="button">Register</button>
        </div>
        <p>Forgot password or username ?</p>
      </div>
    );
  }
}
