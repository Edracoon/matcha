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

import { TagPicker } from 'rsuite';

// Localisation params
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};
function success(pos) {
  var crd = pos.coords;

  console.log("Your current position is:");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}
function errors(err) {
  console.log(`ERROR(${err.code}): ${err.message}`);
}

export default function UserProfile(props) {

  // State
  const [locationAsk, setLocationAsk] = useState(true);
  const [isExtended, setExtended] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const [tags, setTags] = useState([]);
  
  // Values
  const [city, setCity] = useState(props.city === null ? undefined : props.city); // the selected city
  const [country, setCountry] = useState(props.country === null ? undefined : props.country); // the selected country
  const [bio, setBio] = useState(props.bio === null ? undefined : props.bio);
  const [gender1, setGender1] = useState(props.genre1 === null || props.genre1 === 'undefined' ? undefined : props.genre1);
  const [gender2, setGender2] = useState(props.genre2 === null || props.genre2 === 'undefined'  ? undefined : props.genre2);
  const [orientation, setOrientation] = useState(props.orientation === null ? undefined : props.orientation);

  // Options selects
  const [cities, setCities] = useState([]); // all cities from the country if too much cities
  const [CityOption, setCityOption] = useState(undefined); // options cities
  const [CountryOptions, setCountryOptions] = useState([]);
  const genderOption1 = [{value: 1, label: "Male"}, {value: 2, label: "Female"}];
  const genderOption2 = [{value: 1, label: "Cisgender"}, {value: 2, label: "Transgender"}, {value: 3, label: "Non binary"}, {value: 4, label: "Fluid"}];
  const OrientationOption = [{value: 1, label: "Heterosexual"}, {value: 2, label: "Homosexual"}, {value: 3, label: "Bisexual"}, {value: 4, label: "Asexual"}, {value: 5, label: "Pansexual"}];
  
  // Utils
  const [images, setImages] = useState([]);
  const [alert, setAlert] = useState(false);

  // Errors
  const [errorCity, setErrorCity] = useState('');
  const [errorCountry, setErrorCountry ] = useState('');
  const [errorBio, setErrorBio] = useState('');
  const [errorGender1, setErrorGender1] = useState('');
  const [errorGender2, setErrorGender2] = useState('');
  const [errorOrientation, setErrorOrientation] = useState('');


  const validationValues = () => {
    if (country === undefined)
        setErrorCountry('Please provide a valid country !');
      else
        setErrorCountry(undefined);

      if (city === undefined)
        setErrorCity('Provide a valid city from the choose country !');
      else
        setErrorCity(undefined);

      if (bio === undefined || bio === null || bio.length === 0)
        setErrorBio('Please provide a bio !'); 
      else if (bio.length > 110) {
        setErrorBio('Must be 110 characters or less !');
        return false;
      }
      else
        setErrorBio(undefined);
  
      if (gender1 === undefined)
        setErrorGender1('Please provide a valid gender !');
      else
        setErrorGender1(undefined);
      if (gender2 === undefined)
        setErrorGender2('Please provide a valid gender !');
      else 
        setErrorGender2(undefined);

      if (orientation === undefined)
        setErrorOrientation('Please provide a valid sexual orentation !');
      else
        setErrorOrientation(undefined);
    return true;
  }

  const validate = (values) => {
    // setHasChanged(true);
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

    return errors;
  };

  useEffect(() => {
    console.log('useEffect() is called !\n props -> ', props);
    if (locationAsk && navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(async (result) => {
          console.log('result -> ', result);
          navigator.geolocation.getCurrentPosition(success, errors, options);
          try {
            const result = await fetch("https://geolocation-db.com/json/")
              .then((response) => response.json())
              .then((result) => result);
            console.log('result geolocation -> ', result);
            setCountry(result.country_name);
            if (result.city)
              setCity(result.city);
            console.log(result.country_code);
            fetch(`http://localhost:3000/all-cities/${result.country_code}`, {
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
              console.log('heyaaaa', result);
              if (result.length < 1300) {
                setCityOption(result);
                setCities(result);
              }
              if (result.length === 0) {
                setCityOption([{value : 0, label: result.country_name}]);
                setCities([{value : 0, label: result.country_name}]);
              }
              else
                setCities(result);
            });            
          }
          catch (e) {
            console.log(e);
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
        setLocationAsk(false);
    }
    else if (locationAsk) {
      setLocationAsk(false);
      console.log("Sorry Not available!");
    }
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
  }, [locationAsk, CountryOptions]);

  const handleInputChange = (inputValue) => {
    const ret = cities.filter((city) => city.label.startsWith(inputValue));
    if (inputValue === "" && cities.length > 1300) setCityOption(undefined);
    else if (inputValue === "" && cities.length < 1300) setCityOption(cities);
    else setCityOption(ret);
    setHasChanged(true);
  };

  const updateCountry = (e) => {
    setHasChanged(true);
    setErrorCountry(undefined);
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
        console.log('heyo',result);
        if (result.length < 1300) {
          setCityOption(result);
          setCities(result);
        }
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
      firstname: props.firstname === null ? "" : props.firstname,
      lastname: props.lastname === null ? "" : props.lastname,
    },
    validate,
    onSubmit: (values) => {
      // SEND ALL DATA TO SERVER /updateUser et recup info via le token dans le header
    },
  });

  const onSubmitCustom = (values) => {
      if (formik.errors.lastname || formik.errors.firstname)
        return ;

      if (validationValues() === false)
        return ;

      setHasChanged(false);
      console.log({...values, bio, country, city, gender1, gender2, orientation});
      let toSave = JSON.stringify({...values, bio, country, city, gender1, gender2, orientation/*,images*/});
      const token = localStorage.getItem("access_token");
      
      console.log('token->', token);

      try {
        fetch("http://localhost:3000/api/user/update-user", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: toSave,
      })
      .then((response) => {console.log(response); response.json();})
      .then((result) => console.log(result));
    }
    catch(e) { console.log('error -> ', e); }
  }

  return (
    <div className="d-flex align-items-center flex-column justify-content-between">
      <br />
      {!isExtended &&
        <Alert
          variant="warning"
          className="alert-no-padding"
          style={{ marginBottom: "1rem" }}
          onClick={() => setAlert(true)}
        >
          Your profile is not extended (?)
        </Alert>
       }
      <h3 className="title-secondary">{props.username}</h3>
      <Modal show={alert}>
        <Alert
          variant="warning"
          className="alert-no-padding"
          style={{width: "33rem"}}
          onClose={() => {
            setAlert(false);
          }}
          dismissible
        >
          <Alert.Heading>Your profile is not extended !</Alert.Heading>
          <p>You will not be able to match with other people !</p>
          <li>1 - 5 pictures of you (At least one).</li>
          <li>Precise your gender and your sexual orientation.</li>
          <li>Fill in your bio to describe yourself in a few words. </li>
          <li>
            Precise your location to match with people around you !
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
                onChange={(e) => {formik.handleChange(e); setHasChanged(true);}}
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
                onChange={(e) => {formik.handleChange(e); setHasChanged(true);}}
                className="control-form-profile"
              />
              <p className="form-text" style={{ color: "#FADF4B" }}>
                {" "}
                {formik.errors.lastname}
              </p>
            </Form.Group>
            <Form.Group className="custom-group-form" style={{width: "12rem"}}>
              <Form.Label className="form-text">Gender</Form.Label>
              <Select
                style={{
                  width: "9rem",
                  marginTop: "0.8rem",
                }}
                options={genderOption1}
                placeholder={'Select...'}
                value={{label : !gender1 ? 'Select...' : gender1}}
                id="gender1"
                name="gender1"
                onChange={(e) => {setHasChanged(true); setGender1(e.label);}}
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
                {errorGender1}
              </p>
              <Select
                style={{
                  width: "9rem",
                  marginTop: "0.8rem",
                }}
                options={genderOption2}
                placeholder={'Select...'}
                value={{label : !gender2 ? 'Select...' : gender2}}
                id="gender2"
                name="gender2"
                onChange={(e) => {setHasChanged(true); setGender2(e.label);}}
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
                {errorGender2}
              </p>
            </Form.Group>
            <Form.Group className="custom-group-form" style={{width: "12rem"}}>
              <Form.Label className="form-text">Orientation</Form.Label>
              <Select
                style={{
                  width: "9rem",
                  // marginTop: "0.2rem",
                }}
                options={OrientationOption}
                placeholder={'Select...'}
                value={{label : !orientation ? 'Select...' : orientation}}
                id="orientation"
                name="orientation"
                onChange={(e) => {setHasChanged(true); setOrientation(e.label);}}
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
                {errorOrientation}
              </p>
              <TagPicker
                creatable
                data={tags}
                style={{ width: 300 }}
                menuStyle={{ width: 300 }}
                onCreate={(value, item) => {
                  console.log(value, item);
                }}
              />
            </Form.Group>
            <Form.Group
              className="custom-group-form"
              style={{ width: "18rem", marginTop: "0.8rem" }}
            >
              <Form.Label className="form-text">My bio</Form.Label>
              <textarea
                className="text-area"
                id="bio"
                name="bio"
                type="text"
                value={bio}
                placeholder="..."
                onChange={(e) => {setBio(e.target.value); setHasChanged(true);}}
              />
            </Form.Group>
            <p className="form-text" style={{ color: "#FADF4B" }}>
              {" "}
              {errorBio}
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
                onChange={(e) => {setCity(e.label); setErrorCity(undefined);}}
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
              type="button"
              onClick={() => {onSubmitCustom(formik.values)}}
            >
              Save changes
            </button>
          </Form>
        </Row>
      </Container>
    </div>
  );
}
