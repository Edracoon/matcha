import React, { useState } from "react";
import "./Login.css";
import "../style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logomatcha from "../assets/matcha-logo.png";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Container";
import Col from "react-bootstrap/Container";

import { BrowserRouter as Router, Link, Navigate } from "react-router-dom";

import { useFormik } from "formik";
import { useUserContext } from "../UserContext";

export function LoginModal(props) {
  const validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = "Please provide an username !";
    } else if (values.username.length > 20) {
      errors.username = "Must be 20 characters or less";
    }

    if (!values.password) {
      errors.password = "Please provide a password !";
    } else if (values.password.length < 7) {
      errors.password = "Must be 7 characters or more !";
    } else if (values.password.length > 72) {
      errors.password = "Must be less than 72 characters !";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      if (values.username && values.password) {
        props.onClickSubmitLogin({
          username: values.username,
          password: values.password,
        });
      }
    },
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title className="modal-text">Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Form.Label column sm="2">
            Username
          </Form.Label>
          <Form.Control
            size="lg"
            type="username"
            id="username"
            name="username"
            placeholder="Username"
            onChange={formik.handleChange}
          />
          {formik.touched.username && formik.errors.username ? (
            <p style={{ color: "red" }}>{formik.errors.username}</p>
          ) : null}
          <br />
          <Form.Label column sm="2">
            Password
          </Form.Label>
          <Form.Control
            size="lg"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
          />
          {formik.touched.password && formik.errors.password ? (
            <p style={{ color: "red" }}>{formik.errors.password}</p>
          ) : null}
          <br />
          <Link to="/recovery-password">Forgot password ?</Link>
          <br />
          <br />
          <div className="center-btn">
            <button className="button" type="submit">
              Login
            </button>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
}

export function RegisterModal(props) {
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
    }

    if (!values.username) {
      errors.username = "Please provide an username !";
    } else if (values.username.length > 20) {
      errors.username = "Must be 20 characters or less";
    }

    if (values.password1 !== values.password2) {
      errors.password2 = "Passwords are not the same !";
    }

    if (!values.password1) {
      errors.password1 = "Please provide a password !";
    } else if (values.password1.length < 7) {
      errors.password1 = "Must be 7 characters or more !";
    } else if (values.password1.length > 72) {
      errors.password1 = "Must be less than 72 characters !";
    }

    if (!values.password2) {
      errors.password2 = "Please provide a password !";
    } else if (values.password2.length < 7) {
      errors.password2 = "Must be 7 characters or more !";
    } else if (values.password2.length > 72) {
      errors.password2 = "Must be less than 72 characters !";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      password1: "",
      password2: "",
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
        <Form noValidate onSubmit={formik.handleSubmit}>
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
              {formik.touched.email &&
              formik.errors.email &&
              !props.isEmailTaken ? (
                <p style={{ color: "red" }}>{formik.errors.email}</p>
              ) : null}
              {props.isEmailTaken && !formik.errors.email && (
                <p style={{ color: "red" }}>
                  Sorry, this email already in use !
                </p>
              )}
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
              {formik.touched.username &&
              formik.errors.username &&
              !props.isUsernameTaken ? (
                <p style={{ color: "red" }}>{formik.errors.username}</p>
              ) : null}
              {props.isUsernameTaken && !formik.errors.username && (
                <p style={{ color: "red" }}>
                  Sorry, this username already in use !
                </p>
              )}
            </Form.Group>
            <br />
            <Form.Group as={Col} md="6">
              <Form.Label>Password (this will be used to login)</Form.Label>
              <Form.Control
                id="password1"
                name="password1"
                type="password"
                placeholder="Password"
                required
                onChange={formik.handleChange}
              />
              {formik.touched.password1 && formik.errors.password1 ? (
                <p style={{ color: "red" }}>{formik.errors.password1}</p>
              ) : null}
            </Form.Group>
            <br />
            <Form.Group as={Col} md="6">
              <Form.Label>Same password again </Form.Label>
              <Form.Control
                id="password2"
                name="password2"
                type="password"
                placeholder="Password"
                required
                onChange={formik.handleChange}
              />
              {formik.touched.password2 && formik.errors.password2 ? (
                <p style={{ color: "red" }}>{formik.errors.password2}</p>
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
  let [isEmailTaken, setEmailTaken] = React.useState(false);
  let [isUsernameTaken, setUsernameTaken] = React.useState(false);
  let [isWaitingRegister, setWaitingRegister] = React.useState(false);
  let [isFailedLogin, setFailedLogin] = React.useState(false);

  const {
    isLogin: isLoggedIn,
    setLogin: setLoggedIn,
    setJwt,
  } = useUserContext();

  if (isEmailTaken) {
    setTimeout(() => {
      setEmailTaken(false);
    }, 5000);
  }

  if (isUsernameTaken) {
    setTimeout(() => {
      setUsernameTaken(false);
    }, 5000);
  }

  function onClickNone() {
    setLogin(false);
    setRegister(false);
    setEmailTaken(false);
    setUsernameTaken(false);
  }

  const onClickSubmitLogin = async (values) => {
    console.log(JSON.stringify(values));
    console.log(values);
    const json = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(values),
    }).then((response) => response.json());
    switch (json.response) {
      case "Username or password incorrect":
        console.log(json.response);
        setFailedLogin();
        return;
      default:
        setLoggedIn(true);
        setJwt(json.accessToken);
        return;
    }
  };

  async function onClickSubmitRegister(values) {
    console.log(JSON.stringify(values));
    console.log(values);
    const json = await fetch("http://localhost:3000/api/user/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(values),
    }).then((response) => response.json());
    console.log(json);
    switch (json.response) {
      case "email taken":
        setEmailTaken(true);
        return;
      case "username taken":
        setUsernameTaken(true);
        return;
      case "success":
        onClickNone();
        setWaitingRegister(true);
        window.location.href = "/register-confirm";
        return;
    }
  }

  let modalLoginProps = {
    onClickNone: onClickNone,
    onClickSubmitLogin: onClickSubmitLogin,
    isFailedLogin: isFailedLogin,
  };

  let modalRegisterProps = {
    onClickNone: onClickNone,
    onClickSubmitRegister: onClickSubmitRegister,
    isEmailTaken: isEmailTaken,
    isUsernameTaken: isUsernameTaken,
  };

  return (
    <>
      {isLoggedIn || && <Navigate to="/home" replace />}
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
