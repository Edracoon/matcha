import React from "react";
import "./Home.css";
import "../style.css";

import "bootstrap/dist/css/bootstrap.min.css";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { BrowserRouter as Router, Link } from "react-router-dom";

export default class Home extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="d-flex align-items-center flex-column justify-content-between">
        <h1 className="title-matcha">Home Working!</h1>
      </div>
    );
  }
}
