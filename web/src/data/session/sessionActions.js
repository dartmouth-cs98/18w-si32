import * as http from "../../util/http.js";
import history from "../../history.js";

const SESSION_START = "SESSION_START";
const SESSION_DESTROY = "SESSION_DESTROY";

const login = (username, password) => (dispatch, getState) => {
  return http
    .post("/users/login")
    .send({
      username,
      password
    })
    .then(res => {
      dispatch({
        type: SESSION_START,
        data: res.body.session,
      });
    });
};

const logout = () => dispatch => {
  return http
    .post("/users/logout")
    .send()
    .then(res => {
      dispatch({
        type: SESSION_DESTROY
      });
    });
};

const register = (username, password) => dispatch => {
  return http
    .post("/users/register")
    .send({
      username,
      password
    })
    .then(res => {
      dispatch({
        type: SESSION_START,
        data: res.body.session,
      });
    });
};

export { login, register, logout, SESSION_START, SESSION_DESTROY };
