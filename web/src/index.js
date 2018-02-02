import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import "./style.css";
import App from "./app.js";

const bootstrap = () => {
  const container = document.createElement("div");
  container.id = "root";
  document.body.appendChild(container);
  ReactDOM.render(<App />, container);
}

bootstrap();
