import React from "react";
import "./Auth.css";
import "../style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logomatcha from "../assets/matcha-logo.png";

import Modal from "react-bootstrap/Modal";

import { useNavigate } from "react-router-dom";

import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";

export default function Auth() {
  let [isLogin, setLogin] = React.useState(false);
  let [isRegister, setRegister] = React.useState(false);
  let [isEmailTaken, setEmailTaken] = React.useState(false);
  let [isUsernameTaken, setUsernameTaken] = React.useState(false);
  // let [isWaitingRegister, setWaitingRegister] = React.useState(false);
  let [isFailedLogin, setFailedLogin] = React.useState(false);
  let navigate = useNavigate();

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
    setFailedLogin(false);
    setRegister(false);
    setEmailTaken(false);
    setUsernameTaken(false);
  }

  const onClickSubmitLogin = async (values) => {
    console.log(values);
    const json = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(values),
    }).then((response) => response.json());
    switch (json.response) {
      case "Username or password incorrect":
        setFailedLogin(true);
        return;
      default:
        localStorage.setItem("access_token", json.accessToken);
        navigate("/home", { replace: true });
        return;
    }
  };

  async function onClickSubmitRegister(values) {
    console.log(values);
    const json = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
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
        navigate("/register-confirm", { replace: true });
        return;
      default:
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
