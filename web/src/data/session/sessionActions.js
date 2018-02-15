import * as http from "../../util/http.js";

const SESSION_START = "SESSION_START";
const SESSION_DESTROY = "SESSION_DESTROY";

/* eslint-disable no-unused-vars */
// TODO: getState creating eslint error here because it is not used,
// do we need it? 

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
        session: res.body.session,
      });
    });
};

const logout = () => dispatch => {
  return http
    .post("/users/logout")
    .send()
    .then(() => {
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
        session: res.body.session,
      });
    });
};

export { login, register, logout, SESSION_START, SESSION_DESTROY };
