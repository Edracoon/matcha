import React from "react";
import "./Login.css";
import "../style.css";

import "bootstrap/dist/css/bootstrap.min.css";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { BrowserRouter as Router, Link } from "react-router-dom";

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = { Login: false, Register: false, email: "", password: "" };

    this.onClickNone = () => {
      this.setState({
        Login: false,
        Register: false,
      });
    };

    // Fired when login
    this.onClickLogin = () => {
      this.setState({
        Login: true,
        Register: false,
      });
      console.log(this.state);
    };

    // Fired when register pressed
    this.onClickRegister = () => {
      this.setState({
        Login: false,
        Register: true,
      });
      console.log(this.state);
    };

    // Fired when submit login pressed
    this.onClickSubmit = () => {
      console.log(this.state);
    };
  }

  render(props) {
    return (
      <div className="d-flex align-items-center flex-column justify-content-between">
        <h1 className="title-matcha">matcha</h1>
        <div className="gap">
          <button className="button" onClick={this.onClickLogin}>
            Login
          </button>
        </div>
        <div className="gap">
          <Link to="/register">
            <button className="button" onClick={this.onClickRegister}>
              Register
            </button>
          </Link>
        </div>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.Login}
          onHide={this.onClickNone}
        >
          <Modal.Header closeButton>
            <Modal.Title className="modal-text">Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label column sm="2">
              Email
            </Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="name@example.com"
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
            <br />
            <Form.Label column sm="2">
              Password
            </Form.Label>
            <Form.Control
              size="lg"
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <br />
            <Link to="/recovery-password">Forgot password or username ?</Link>
            <br />
            <br />
            <div className="center-btn">
              <button
                className="button"
                variant="primary"
                onClick={this.onClickSubmit}
              >
                Login
              </button>
            </div>
            <br />
            <div className="center-btn">
              <button
                className="button"
                variant="secondary"
                onClick={this.onClickNone}
              >
                Close
              </button>
            </div>
          </Modal.Body>
        </Modal>
        {this.state.Register === true && <h4>inRegister</h4>}
      </div>
    );
  }
}
