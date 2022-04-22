import React, { useState, useMemo } from "react";

import Select from "react-select";
import countryList from "react-select-country-list";

import ImageHandler from "./ImageHandler";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "../style.css";
import "./UserProfile.css";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Container";
import Col from "react-bootstrap/Container";
import { Container } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";

import { useFormik } from "formik";

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
  } else if (values.bio.length > 110) {
    errors.bio = "Must be 110 characters or less.";
  }
  return errors;
};

var headers = new Headers();
// headers.append("X-CSCAPI-KEY", "API_KEY");

var requestOptions = {};

export default function UserProfile(props) {
  const [isExtended, setExtended] = useState(false);

  const [images, setImages] = useState([]);
  const [alert, setAlert] = useState(false);
  const [country, setCountry] = useState(undefined);
  const [city, setCity] = useState(undefined);
  const [cityOptions, setCityOptions] = useState([]);
  const options = useMemo(() => countryList().getData(), []);

  const updateCountry = (e) => {
    console.log(e.label);
    setCountry(e.label);
    console.log(options);

    fetch(`http://localhost:3000/retrieve-cities/${e.label}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((results) => {
        console.log(results);
        results = results.map((value) => {
          return { value: "1", label: value };
        });
        console.log(results);
        setCityOptions(results);
      });
  };

  // console.log(images.length);
  // console.log("props", props);

  const formik = useFormik({
    initialValues: {
      firstname: !props.firstname ? "" : props.firstname,
      lastname: !props.familyname ? "" : props.familyname,
      username: !props.username ? "" : props.username,
      bio: !props.bio ? "" : props.bio,
    },
    validate,
    onSubmit: (values) => {
      console.log("OnSubmit : ", images, values, country);
    },
  });

  return (
    <div className="d-flex align-items-center flex-column justify-content-between">
      <br />
      <h1 className="title-secondary">Your profile</h1>
      <br />
      <Alert
        variant="warning"
        className="alert-no-padding"
        style={{ marginBottom: "1rem" }}
        onClick={() => setAlert(true)}
      >
        Your profile is not extended (?)
      </Alert>
      <Modal show={alert}>
        <Alert
          variant="warning"
          className="alert-no-padding"
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
      <Container>
        <Row>
          <Col align="center">
            <ImageHandler toUpload={setImages} />
          </Col>
        </Row>

        <Row align="center">
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Form.Group
              className="custom-group-form"
              style={{ width: "18rem", marginTop: "0.8rem" }}
            >
              <Form.Label className="form-text"> First name</Form.Label>
              <Form.Control
                required
                id="firstname"
                name="firstname"
                type="text"
                value={formik.values.firstname}
                placeholder="First name"
                onChange={formik.handleChange}
              />
              <p className="form-text" style={{ color: "#FADF4B" }}>
                {" "}
                {formik.errors.firstname}
              </p>
            </Form.Group>
            <Form.Group
              className="custom-group-form"
              style={{ width: "18rem", marginTop: "0.8rem" }}
            >
              <Form.Label className="form-text">Last name</Form.Label>
              <Form.Control
                required
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Last name"
                value={formik.values.lastname}
                onChange={formik.handleChange}
              />
              <p className="form-text" style={{ color: "#FADF4B" }}>
                {" "}
                {formik.errors.lastname}
              </p>
            </Form.Group>
            <Form.Group
              className="custom-group-form"
              style={{ width: "18rem", marginTop: "0.8rem" }}
            >
              <Form.Label className="form-text">
                Username (Used to login)
              </Form.Label>
              <Form.Control
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
              />
              <p className="form-text" style={{ color: "#FADF4B" }}>
                {" "}
                {formik.errors.username}
              </p>
            </Form.Group>
            <Form.Group
              className="custom-group-form"
              style={{ width: "18rem", marginTop: "0.8rem" }}
            >
              <Form.Label className="form-text">Your bio</Form.Label>
              <textarea
                className="form-control"
                id="bio"
                name="bio"
                type="text"
                value={formik.values.bio}
                placeholder="Your bio"
                onChange={formik.handleChange}
                style={{ height: "4.5rem" }}
              />
            </Form.Group>
            <p className="form-text" style={{ color: "#FADF4B" }}>
              {" "}
              {formik.errors.bio}
            </p>
            <Form.Group className="custom-group-form">
              <Form.Label className="form-text">Country</Form.Label>
              <Select
                style={{
                  width: "18rem",
                  marginTop: "0.8rem",
                }}
                options={options}
                // value={props}
                id="country"
                name="country"
                onChange={updateCountry}
              />
            </Form.Group>
            <Form.Group className="custom-group-form">
              <Form.Label className="form-text">City</Form.Label>
              <Select
                style={{
                  width: "18rem",
                  marginTop: "0.8rem",
                }}
                options={cityOptions}
                // value={props}
                id="city"
                name="city"
                onChange={(e) => setCity(e.abel)}
              />
            </Form.Group>
            <Col align="center">
              <Alert
                variant="warning"
                style={{ width: "20rem", marginTop: "1.5rem" }}
              >
                <Alert.Heading>
                  Care, you have some unsaved changes !
                </Alert.Heading>
              </Alert>
            </Col>
            <button
              className="button"
              style={{
                width: "10rem",
                height: "3.3rem",
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
              }}
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
