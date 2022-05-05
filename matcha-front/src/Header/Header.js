import React from "react";
import logomatcha from "../assets/matcha-logo.png";
import "./Header.css";

import Navbar from "react-bootstrap/Navbar";
import { Nav } from "react-bootstrap";
import Container from "react-bootstrap/Container";

import { useNavigate } from "react-router-dom";

import { useUserContext } from "../UserContext";

export default function Header(props) {
  const { logout } = useUserContext();
  const navigate = useNavigate();

  return (
    <Navbar collapseOnSelect expand="lg">
      <Container>
        <Navbar.Brand>
          <h2 className="title-navbar">
            <img
              alt=""
              src={logomatcha}
              width="40"
              height="45"
              className="d-inline-block align-top"
            />{" "}
            matcha
          </h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <div className="vertical-line" />
            <Nav.Link onClick={() => navigate("/home")} className="title-links">
              Home
            </Nav.Link>

            <div className="vertical-line" />
            <Nav.Link
              onClick={() => navigate("/matchme")}
              className="title-links"
            >
              Find Love
            </Nav.Link>

            <div className="vertical-line" />
            <Nav.Link
              onClick={() => navigate("/research")}
              className="title-links"
            >
              Research
            </Nav.Link>
            <div className="vertical-line" />
            <Nav.Link onClick={() => logout()} className="title-links">
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
