import { SESSION_START, SESSION_DESTROY } from "./sessionActions";

// TODO replace hacky localStorage and initial state stuff for persisting
// the session token. Should be in a cookie (?) and part of some actual bootstrap process

const INITIAL_STATE = { token: localStorage["token"] };

export default function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SESSION_START:
      localStorage["token"] = action.token;

      return Object.assign({}, state, {
        token: action.token
      });

    case SESSION_DESTROY:
      // clear token
      localStorage["token"] = "";
      INITIAL_STATE.token = "";

      return INITIAL_STATE;
  }

  return state;
}
