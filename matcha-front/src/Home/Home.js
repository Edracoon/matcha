import React from "react";
import "./Home.css";
import "../style.css";

import "bootstrap/dist/css/bootstrap.min.css";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { BrowserRouter as Router, Link } from "react-router-dom";
import { useUserContext } from "../UserContext";

export default function Home() {
  const { logout } = useUserContext();

  return (
    <div className="d-flex align-items-center flex-column justify-content-between">
      <h1 className="title-matcha">Home Working!</h1>
      <button onClick={() => logout()} className="button">
        Disconnect
      </button>
    </div>
  );
}
