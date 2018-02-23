import * as http from "../../util/http.js";

const SESSION_START = "SESSION_START";
const SESSION_DESTROY = "SESSION_DESTROY";
const SET_USER_FOR_SESSION = "SET_USER_FOR_SESSION";
const RESET_USER_FOR_SESSION = "RESET_USER_FOR_SESSION";

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
      dispatch({
        type: SET_USER_FOR_SESSION,
        user: res.body.user,
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
      dispatch({
        type: RESET_USER_FOR_SESSION
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
      dispatch({
        type: SET_USER_FOR_SESSION,
        user: res.body.user,
      });
    });
};

const setUserForSession = (userId) => dispatch => {
  return http.get(`/users/${userId}`)
    .then(res => {
      dispatch({
        type: SET_USER_FOR_SESSION,
        user: res.body
      });
      dispatch({
        type: "RECEIVED_USER",
        payload: [res.body],
        doMerge: true,
      });
    });
};

const resetUserForSession = () => dispatch => {
  dispatch({
    type: RESET_USER_FOR_SESSION
  });
};

export {
  login,
  register,
  logout,
  setUserForSession,
  resetUserForSession,
  SESSION_START,
  SESSION_DESTROY,
  SET_USER_FOR_SESSION,
  RESET_USER_FOR_SESSION,
};
