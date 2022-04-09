import React from "react";
import "./Recovery-Password.css";
import "../style.css";

import "bootstrap/dist/css/bootstrap.min.css";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { BrowserRouter as Router, Link } from "react-router-dom";

export default class RecoveryPassword extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="d-flex align-items-center flex-column justify-content-between">
        <h1 className="title-matcha">RecoveryPassword Working!</h1>
      </div>
    );
  }
}
