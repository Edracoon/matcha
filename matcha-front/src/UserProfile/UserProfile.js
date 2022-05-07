import React, { useState, useEffect } from "react";

import Select from "react-select";

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

export default function UserProfile(props) {
  
  const [isExtended, setExtended] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const [city, setCity] = useState(undefined); // the selected city
  const [country, setCountry] = useState(undefined); // the selected country

  const [cities, setCities] = useState([]); // all cities from the country if too much cities
  const [CityOption, setCityOption] = useState(undefined); // options cities

  const [images, setImages] = useState([]);
  const [alert, setAlert] = useState(false);

  const [errorCity, setErrorCity] = useState('');
  const [errorCountry, setErrorCountry ] = useState('');

  const [CountryOptions, setCountryOptions] = useState([]);

  const validate = (values) => {
    setHasChanged(true);
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

  useEffect(() => {
    if (CountryOptions.length === 0) {
      fetch("http://localhost:3000/all-countries", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      })
      .then((response) => response.json())
      .then((result) => {
          setCountryOptions(result);
      });  
    }
    if (!hasChanged && ((props.city && city !== props.city) || (props.country && country !== props.country)))
      setHasChanged(true);
  });

  const handleInputChange = (inputValue) => {
    const ret = cities.filter((city) => city.label.startsWith(inputValue));
    if (inputValue === "" && cities.length > 1300) setCityOption(undefined);
    else if (inputValue === "" && cities.length < 1300) setCityOption(cities);
    else setCityOption(ret);
  };

  const updateCountry = (e) => {
    setCountry(e.label);
    setCity(undefined);
    setCities([]);
    setCityOption(undefined);
    fetch(`http://localhost:3000/all-cities/${e.value}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.length < 1300)
          setCityOption(result);
        if (result.length === 0) {
          setCityOption([{value : 0, label: e.label}]);
          setCities([{value : 0, label: e.label}]);
        }
        else
          setCities(result);
      });
  };

  const formik = useFormik({
    initialValues: {
      firstname: !props.firstname ? "" : props.firstname,
      lastname: !props.familyname ? "" : props.familyname,
      username: !props.username ? "" : props.username,
      bio: !props.bio ? "" : props.bio,
    },
    validate,
    onSubmit: (values) => {
      console.log("OnSubmit : ", images, values, country, city);
      if (country === undefined)
        setErrorCountry('Please provide a valid country !');
      else
        setErrorCountry('');
      if (city === undefined)
        setErrorCity('Provide a valid city from the choose country !');
      else
        setErrorCity('');
      
      // SEND ALL DATA TO SERVER /updateUser et recup info via le token dans le header
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
              style={{ width: "18rem", marginTop: "0.8rem"}}
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
                className="control-form-profile"
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
                className="control-form-profile"
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
                className="control-form-profile"
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
                className="text-area"
                id="bio"
                name="bio"
                type="text"
                value={formik.values.bio}
                placeholder="My bio..."
                onChange={formik.handleChange}
              />
            </Form.Group>
            <p className="form-text" style={{ color: "#FADF4B" }}>
              {" "}
              {formik.errors.bio}
            </p>
            <Form.Group className="custom-group-form">
              <Form.Label className="form-text">Country</Form.Label>
              <Select
                // className="control-form-profile"
                style={{
                  width: "18rem",
                  marginTop: "0.8rem",
                }}
                options={CountryOptions}
                placeholder={'Search ...'}
                value={{label : !country ? 'Search...' : country}}
                id="country"
                name="country"
                onChange={(e) => {updateCountry(e)}}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 18,
                  color: 'white',
                  colors: {
                    ...theme.colors,
                    primary25: '',
                    primary: 'black',
                    neutral0: 'rgba(254, 136, 120, 1)',
                    neutral80: 'white',
                  },
                })}
              />
              <p className="form-text" style={{ color: "#FADF4B" }}>
                {" "}
                {errorCountry}
              </p>
            </Form.Group>
            <Form.Group className="custom-group-form">
              <Form.Label className="form-text">City</Form.Label>
              <Select
                style={{
                  width: "18rem",
                  marginTop: "0.8rem",
                }}
                options={CityOption}
                placeholder={'Search ...'}
                onInputChange={handleInputChange}
                value={{label : !city ? 'Search...' : city}}
                id="city"
                name="city"
                onChange={(e) => setCity(e.label)}
                noOptionsMessage={({inputValue}) => !inputValue ? 'Type something to search ...' : "No results found"}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 18,
                  color: 'white',
                  colors: {
                    ...theme.colors,
                    primary25: '',
                    primary: 'black',
                    neutral0: 'rgba(254, 136, 120, 1)',
                    neutral80: 'white',
                  },
                })}
              />
              <p className="form-text" style={{ color: "#FADF4B" }}>
                {" "}
                {errorCity}
              </p>
            </Form.Group>
            {hasChanged &&
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
            }
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
