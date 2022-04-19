import React from "react";
import "./Auth.css";
import "../style.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Container";
import Col from "react-bootstrap/Container";

import { useFormik } from "formik";

export function RegisterModal(props) {
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
