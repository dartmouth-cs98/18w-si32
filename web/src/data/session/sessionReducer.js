import { SESSION_START, SESSION_DESTROY } from "./sessionActions";

// TODO replace hacky localStorage and initial state stuff for persisting
// the session token. Should be in a cookie (?) and part of some actual bootstrap process

const INITIAL_STATE = { token: localStorage["token"] };

export default function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SESSION_START:
      localStorage["token"] = action.session.token;

      return Object.assign({}, state, action.session);

    case SESSION_DESTROY:
      // clear token
      localStorage["token"] = "";
      INITIAL_STATE.token = "";

      return Object.assign({}, INITIAL_STATE);
  }

  return state;
}
