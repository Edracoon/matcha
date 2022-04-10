import React from "react";
import "./Login.css";
import "../style.css";

import "bootstrap/dist/css/bootstrap.min.css";

import logomatcha from "../assets/matcha-logo.png";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Container";
import Col from "react-bootstrap/Container";

import { BrowserRouter as Router, Link } from "react-router-dom";

export class LoginModal extends React.Component {
  constructor(props) {
    super();

    this.email = "";
    this.password = "";

    this.onClickNone = props.onClickNone;
    this.onClickSubmitLogin = props.onClickSubmitLogin;

    this.onChangeEmail = (e) => {
      this.email = e.target.value;
    };
    this.onChangePassword = (e) => {
      this.password = e.target.value;
    };

    this.submit = () => {
      this.onClickSubmitLogin({
        email: this.email,
        password: this.password,
      });
    };
  }

  render() {
    return (
      <>
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
            onChange={this.onChangeEmail}
          />
          <br />
          <Form.Label column sm="2">
            Password
          </Form.Label>
          <Form.Control
            size="lg"
            type="password"
            placeholder="Password"
            onChange={this.onChangePassword}
          />
          <br />
          <Link to="/recovery-password">Forgot password ?</Link>
          <br />
          <br />
          <div className="center-btn">
            <button className="button" variant="primary" onClick={this.submit}>
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
      </>
    );
  }
}

export class RegisterModal extends React.Component {
  constructor(props) {
    super();

    this.validated = false;

    this.email = "";
    this.password = "";
    this.username = "";
    this.firstname = "";
    this.lasname = "";

    this.onClickNone = props.onClickNone;
    this.onClickSubmitRegister = props.onClickSubmitRegister;

    this.onChangeEmail = (e) => {
      this.email = e.target.value;
    };
    this.onChangePassword = (e) => {
      this.password = e.target.value;
    };
    this.onChangeUsername = (e) => {
      this.username = e.target.value;
    };
    this.onChangeFirstname = (e) => {
      this.firstname = e.target.value;
    };
    this.onChangeLastname = (e) => {
      this.lastname = e.target.value;
    };

    this.submit = () => {
      this.onClickSubmitRegister({
        email: this.email,
        password: this.password,
        username: this.username,
        firstname: this.firstname,
        lastname: this.lastname,
      });
    };

    this.handleSubmit = (event) => {
      const form = event.currentTarget;
      console.log(form);
    };
  }

  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title className="modal-text">Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            // noValidate
            // validated={this.validated}
            onSubmit={(event) => {
              console.log(event.currentTarget);
            }}
          >
            <Form.Label column sm="2">
              Email
            </Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="name@example.com"
              onChange={this.onChangeEmail}
            />
            <br />
            <Form.Label column sm="2">
              Password
            </Form.Label>
            <Form.Control
              size="lg"
              type="password"
              placeholder="Password"
              onChange={this.onChangePassword}
            />
            <br />
            <Form.Label column sm="2">
              Username
            </Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="Username"
              onChange={this.onChangeUsername}
            />
            <br />
            <Form.Label column sm="2">
              Firstname
            </Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="Firstname"
              onChange={this.onChangeFirstname}
            />
            <br />
            <Form.Label column sm="2">
              Lastname
            </Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="Lastname"
              onChange={this.onChangeLastname}
            />
            <br />
            <Form.Label column sm="2">
              Birth gender
            </Form.Label>
            <br />
            <br />
            <br />
            <div className="center-btn">
              <button
                className="button"
                variant="primary"
                // onClick={this.submit}
                type="submit"
              >
                Register
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
          </Form>
        </Modal.Body>
      </>
    );
  }
}

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
    };

    // Fired when register pressed
    this.onClickRegister = () => {
      this.setState({
        Login: false,
        Register: true,
      });
    };

    // Fired when submit login pressed
    this.onClickSubmitLogin = (values) => {
      console.log(values);
    };

    this.onClickSubmitRegister = (values) => {
      console.log(values);
    };

    this.modalLoginProps = {
      onClickNone: this.onClickNone,
      onClickSubmitLogin: this.onClickSubmitLogin,
    };

    this.modalRegisterProps = {
      onClickNone: this.onClickNone,
      onClickSubmitRegister: this.onClickSubmitRegister,
    };
  }

  render(props) {
    return (
      <>
        <header>
          <div className="d-flex align-items-center flex-column justify-content-between">
            <img alt="" witdh="175" height="175" src={logomatcha}></img>
            <h1 className="title-matcha">matcha</h1>
            <div className="gap">
              <button className="button" onClick={this.onClickLogin}>
                Login
              </button>
            </div>
            <div className="gap">
              <button className="button" onClick={this.onClickRegister}>
                Register
              </button>
            </div>
            <Modal
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={this.state.Login}
              onHide={this.onClickNone}
            >
              <LoginModal {...this.modalLoginProps} />
            </Modal>
            <Modal
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={this.state.Register}
              onHide={this.onClickNone}
            >
              <RegisterModal {...this.modalRegisterProps} />
            </Modal>
          </div>
        </header>
        <footer id="footer">
          <div className="d-flex align-items-center flex-column justify-content-between">
            <div className="col-md-6 item text">
              <h3 className="mb-0 py-2" style={{ textAlign: "center" }}>
                About matcha
              </h3>
              <p
                className="mb-0 py-2"
                style={{ textAlign: "center", fontSize: "20px" }}
              >
                Matcha is a dating site designed to meet people through your
                interests. If you want to find love, make friends, matcha is for
                you.
              </p>
            </div>
          </div>
        </footer>
      </>
    );
  }
}
