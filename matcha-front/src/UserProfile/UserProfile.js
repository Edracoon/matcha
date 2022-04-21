import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../style.css";
import "./UserProfile.css";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Container";
import Col from "react-bootstrap/Container";

import { useFormik } from "formik";

import { Container } from "react-bootstrap";

import Alert from "react-bootstrap/Alert";

import ImageHandler from "./ImageHandler";

const validate = (values) => {
  const errors = {};
  if (!values.firstname) {
    errors.firstname = "Please provide your first name !";
  } else if (values.firstname.length > 15) {
    errors.firstname = "Must be 15 characters or less.";
  }

  if (!values.lastname) {
    errors.lastname = "Please provide your last name !";
  } else if (values.lastname.length > 20) {
    errors.lastname = "Must be 20 characters or less.";
  }

  if (!values.username) {
    errors.username = "Please provide an username !";
  } else if (values.username.length > 20) {
    errors.username = "Must be 20 characters or less.";
  }

  if (!values.bio) {
    errors.bio = "Please provide a bio !";
  } else if (values.bio.length > 255) {
    errors.username = "Must be 255 characters or less.";
  }
  return errors;
};

export default function UserProfile(props) {
  const [images, setImages] = useState([]);
  const [alert, setAlert] = useState(true);

  // console.log(images.length);
  // console.log("props", props);

  const formik = useFormik({
    initialValues: {
      firstname: props.firstname,
      lastname: props.familyname,
      username: props.username,
      bio: props.bio,
    },
    validate,
    onSubmit: (values) => {},
  });

  return (
    <div className="d-flex align-items-center flex-column justify-content-between">
      <br />
      <h1 className="title-secondary">Your profile</h1>
      <br />
      {alert && (
        <Modal show={alert}>
          <Alert
            variant="warning"
            onClose={() => {
              setAlert(false);
            }}
            dismissible
          >
            <Alert.Heading>Your profile is not extended !</Alert.Heading>
            <p>You will not be able to match with other people !</p>
            <li>1 - 5 pictures of you (At least one).</li>
            <li>Precise your birth gender and your actual gender.</li>
            <li>Fill in your bio to describe yourself in a few words. </li>
            <li>
              Precise your city and address to match with people around you !
            </li>
          </Alert>
        </Modal>
      )}
      <Container>
        <Row>
          <Col align="center">
            <ImageHandler toUpload={setImages} />
          </Col>
        </Row>

        <Row>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Form.Group
              as={Col}
              md="2"
              className="custom-group-form"
              style={{ width: "18rem" }}
            >
              <Form.Label className="form-text"> First name</Form.Label>
              <Form.Control
                required
                id="firstname"
                name="firstname"
                type="text"
                value={props.firstname}
                placeholder="First name"
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="2"
              className="custom-group-form"
              style={{ width: "18rem" }}
            >
              <Form.Label className="form-text">Last name</Form.Label>
              <Form.Control
                required
                id="lastname"
                name="lastname"
                type="text"
                value={props.familyname}
                placeholder="Last name"
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="2"
              className="custom-group-form"
              style={{ width: "18rem" }}
            >
              <Form.Label className="form-text">
                Username (Used to login)
              </Form.Label>
              <Form.Control
                id="username"
                name="username"
                type="text"
                value={props.username}
                placeholder="Username"
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="2"
              className="custom-group-form"
              style={{ width: "18rem" }}
            >
              <Form.Label className="form-text">
                Username (Used to login)
              </Form.Label>
              <Form.Control
                id="bio"
                name="bio"
                type="text"
                value={props.bio}
                placeholder="Your bio"
                onChange={formik.handleChange}
              />
            </Form.Group>
            <button
              className="button"
              style={{ width: "10rem", height: "3.3rem" }}
              type="submit"
            >
              Save changes
            </button>
          </Form>
        </Row>
      </Container>
    </div>
  );
}
