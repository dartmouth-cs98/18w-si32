import * as http from "../../util/http.js";
import * as sessionManager from "./sessionManager.js";
import history from "../../history.js";

// makes requests to API and sets local sessionManager accordingly

const login = (username, password) => {
  console.log("Login", username, password);
  return http
    .post("/users/login")
    .send({
      username,
      password
    })
    .then(res => {
      sessionManager.init(res.body.session.token);
      return true;
    });
};

const logout = () => {
  return http
    .post("/users/logout")
    .send()
    .then(res => {
      sessionManager.destroy();
    });
};

const register = (username, password) => {
  return http
    .post("/users/register")
    .send({
      username,
      password
    })
    .then(res => {
      debugger;
      sessionManager.init(res.body.session.token);
      return true;
    });

};

export { login, register, logout };
