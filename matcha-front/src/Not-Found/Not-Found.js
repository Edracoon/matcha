import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style.css";

import { BrowserRouter as useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="d-flex align-items-center flex-column justify-content-between">
      <h1 className="title-matcha">404</h1>
      <h4 className="title-matcha">Page Not Found !</h4>
      <button className="button" onClick={() => navigate("/home")}>
        Home
      </button>
    </div>
  );
}
