import React from "react";
import "./Loading.css";
import "../style.css";

import "bootstrap/dist/css/bootstrap.min.css";

export default function Loading() {
  return (
    <div className="d-flex align-items-center flex-column justify-content-between">
      <h1 className="title-matcha">Loading ...</h1>
    </div>
  );
}
