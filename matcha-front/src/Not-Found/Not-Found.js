import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style.css";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { BrowserRouter as Router, Link } from "react-router-dom";

export default class NotFound extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="d-flex align-items-center flex-column justify-content-between">
        <h1 className="title-matcha">404</h1>
        <h1 className="title-matcha">Page Not Found !</h1>
        <Link to="/home">
          <button className="button">Home</button>
        </Link>
      </div>
    );
  }
}
