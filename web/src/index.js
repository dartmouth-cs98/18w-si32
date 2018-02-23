import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { API_URL } from "./config";

import "./style/style.css";
import App from "./app";
import store from "./store";

const bootstrap = () => {
  const container = document.createElement("div");
  container.id = "root";
  document.body.appendChild(container);
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    container
  );
};

bootstrap();
