import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style.css";
import profile_icon from "../assets/profile-icon.png";

import Modal from "react-bootstrap/Modal";
import { Container, Row, Col } from "react-bootstrap";
import { Carousel } from "react-bootstrap";

import Alert from "react-bootstrap/Alert";

import { Form } from "react-bootstrap";

import { BrowserRouter as Router, Link } from "react-router-dom";

export default function UserProfile(props) {
  //   const [file, setFile] = useState();
  let images_to_upload = [];

  images_to_upload.push(profile_icon);

  const handleChange = (event) => {
    console.log(event.target.files[0]);
    images_to_upload.push(event.target.files[0]);
  };

  return (
    <div className="d-flex align-items-center flex-column justify-content-between">
      <h1 className="title-secondary">Your profile</h1>
      <Alert variant="warning" /*onClose={() => {}} dismissible*/>
        <Alert.Heading>Your profile is not extended !</Alert.Heading>
        <p>You will not be able to match with other people !</p>
        <li> 1 - 5 pictures of you (At least one).</li>
        <li> Precise your birth gender and your actual gender.</li>
        <li> Fill in your bio to describe yourself in a few words. </li>
        <li>Precise your city and address to match with people around you !</li>
      </Alert>
      {/* <div>
        <img alt="" src={profile_icon} width="220" height="220" />
      </div> */}
      <Container>
        <Row>
          <Col />
          <Col style={{ textAlign: "center" }}>
            <Carousel variant="dark">
              {images_to_upload.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img alt="" src={img} width="220" height="220" />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col />
        </Row>

        <Row>
          <Col />
          <Col>
            <Form.Control
              type="file"
              id="upload-picture"
              label="Upload a picture"
              onChange={handleChange}
              custom="true"
            />
          </Col>
          <Col />
        </Row>
      </Container>
    </div>
  );
}
