import * as http from "../../util/http.js";
import * as sessionManager from "./sessionManager.js";

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

const logout = () => {};

const register = () => {};

export { login, register, logout };
