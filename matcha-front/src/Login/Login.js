import React from "react";
import "./Login.css";
import "../style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logomatcha from "../assets/matcha-logo.png";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Container";
import Col from "react-bootstrap/Container";

import { BrowserRouter as Router, Link } from "react-router-dom";

import { useFormik } from "formik";

export function LoginModal(props) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  function submit() {
    props.onClickSubmitLogin({
      username: username,
      password: password,
    });
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title className="modal-text">Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label column sm="2">
          Username
        </Form.Label>
        <Form.Control
          size="lg"
          type="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.currentTarget.value)}
        />
        <br />
        <Form.Label column sm="2">
          Password
        </Form.Label>
        <Form.Control
          size="lg"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <br />
        <Link to="/recovery-password">Forgot password ?</Link>
        <br />
        <br />
        <div className="center-btn">
          <button className="button" variant="primary" onClick={submit}>
            Login
          </button>
        </div>
        <br />
        <div className="center-btn">
          <button
            className="button"
            variant="secondary"
            onClick={props.onClickNone}
          >
            Close
          </button>
        </div>
      </Modal.Body>
    </>
  );
}

export function RegisterModal(props) {
  let [validated, setValidated] = React.useState(false);
  let [error, setError] = React.useState("");

  const validate = (values) => {
    const errors = {};
    if (!values.firstname) {
      errors.firstname = "Please provide your first name !";
    } else if (values.firstname.length > 15) {
      errors.firstname = "Must be 15 characters or less";
    }

    if (!values.lastname) {
      errors.lastname = "Please provide your last name !";
    } else if (values.lastname.length > 20) {
      errors.lastname = "Must be 20 characters or less";
    }

    if (!values.email) {
      errors.email = "Please provide your email address !";
    } else if (
      !String(values.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      errors.email = "Invalid email address";
    } else {
    }

    if (!values.username) {
      errors.username = "Please provide an username !";
    } else if (values.username.length > 20) {
      errors.username = "Must be 20 characters or less";
    }

    if (!values.password) {
      errors.password = "Please provide an password !";
    } else if (values.password.length < 7) {
      errors.password = "Must be 7 characters or more";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      props.onClickSubmitRegister(values);
    },
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title className="modal-text">Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={formik.handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="4">
              <Form.Label>First name</Form.Label>
              <Form.Control
                required
                id="firstname"
                name="firstname"
                type="text"
                placeholder="First name"
                onChange={formik.handleChange}
              />
              {formik.touched.firstname && formik.errors.firstname ? (
                <p style={{ color: "red" }}>{formik.errors.firstname}</p>
              ) : null}
            </Form.Group>
            <br />
            <Form.Group as={Col} md="4">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                required
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Last name"
                onChange={formik.handleChange}
              />
              {formik.touched.lastname && formik.errors.lastname ? (
                <p style={{ color: "red" }}>{formik.errors.lastname}</p>
              ) : null}
            </Form.Group>
            <br />
            <Form.Group as={Col} md="4">
              <Form.Label>Email</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                <Form.Control
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  aria-describedby="inputGroupPrepend"
                  required
                  onChange={formik.handleChange}
                />
              </InputGroup>
              {formik.touched.email && formik.errors.email ? (
                <p style={{ color: "red" }}>{formik.errors.email}</p>
              ) : null}
            </Form.Group>
          </Row>
          <br />
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Username (this will be used to login)</Form.Label>
              <Form.Control
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                required
                onChange={formik.handleChange}
              />
              {formik.touched.username && formik.errors.username ? (
                <p style={{ color: "red" }}>{formik.errors.username}</p>
              ) : null}
            </Form.Group>
            <br />
            <Form.Group as={Col} md="6">
              <Form.Label>Password (this will be used to login)</Form.Label>
              <Form.Control
                id="password"
                name="password"
                type="Password"
                placeholder="Password"
                required
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password ? (
                <p style={{ color: "red" }}>{formik.errors.password}</p>
              ) : null}
            </Form.Group>
          </Row>
          <br />
          <div className="center-btn">
            <button type="submit" className="button">
              Register
            </button>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
}

export default function Login() {
  let [isLogin, setLogin] = React.useState(false);
  let [isRegister, setRegister] = React.useState(false);

  function onClickNone() {
    setLogin(false);
    setRegister(false);
  }

  function onClickSubmitLogin(values) {
    console.log(values);
  }

  function onClickSubmitRegister(values) {
    console.log(values);
  }

  let modalLoginProps = {
    onClickNone: onClickNone,
    onClickSubmitLogin: onClickSubmitLogin,
  };

  let modalRegisterProps = {
    onClickNone: onClickNone,
    onClickSubmitRegister: onClickSubmitRegister,
  };

  return (
    <>
      <header>
        <div className="d-flex align-items-center flex-column justify-content-between">
          <img alt="" witdh="175" height="175" src={logomatcha}></img>
          <h1 className="title-matcha">matcha</h1>
          <div className="gap">
            <button className="button" onClick={() => setLogin(true)}>
              Login
            </button>
          </div>
          <div className="gap">
            <button className="button" onClick={() => setRegister(true)}>
              Register
            </button>
          </div>
          <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={isLogin}
            onHide={onClickNone}
          >
            <LoginModal {...modalLoginProps} />
          </Modal>
          <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={isRegister}
            onHide={onClickNone}
          >
            <RegisterModal {...modalRegisterProps} />
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
