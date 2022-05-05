import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style.css";

import { useNavigate } from "react-router-dom";

export default function RegisterConfirm() {
  const navigate = useNavigate();
  return (
    <div className="d-flex align-items-center flex-column justify-content-between">
      <h4 className="title-matcha">RegisterConfirm working !</h4>
      <button className="button" onClick={() => { navigate("/home", { replace: true }) }}>
        Home
      </button>
    </div>
  );
}
