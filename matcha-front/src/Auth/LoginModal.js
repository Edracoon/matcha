import React from "react";
import "./Auth.css";
import "../style.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { Link } from "react-router-dom";

import { useFormik } from "formik";

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
          {props.isFailedLogin &&
            !formik.errors.username &&
            !formik.errors.password && (
              <p style={{ color: "red" }}>Username or password incorrect !</p>
            )}
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
