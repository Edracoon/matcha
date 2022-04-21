import React, { useEffect, useState } from "react";
import "./Home.css";
import "../style.css";

import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Link } from "react-router-dom";

import Loading from "../Loading/Loading";
import Header from "../Header/Header";
import UserProfile from "../UserProfile/UserProfile";

export default function Home() {
  const [User, setUser] = useState(null);

  useEffect(() => {
    if (!User) {
      fetch("http://localhost:3000/api/user", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      }).then((response) =>
        response.json().then((json) => {
          setUser(json);
        })
      );
    }
  }, [User]);

  return (
    <>
      {!User && <Loading />}
      {User && (
        <>
          <Header />
          <UserProfile {...User} />
        </>
      )}
    </>
  );
}
