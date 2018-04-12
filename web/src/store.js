import { createStore, applyMiddleware, combineReducers } from "redux";
import logger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { reducer as formReducer } from "redux-form";

import session from "./data/session/sessionReducer";
import bots from "./data/bot/botReducer";
import users from "./data/user/userReducer";
import matches from "./data/match/matchReducer";
import groups from "./data/group/groupReducer";
import leaderboards from "./data/leaderboard/leaderboardReducer";

const reducer = combineReducers({
  session,
  bots,
  matches,
  users,
  groups,
  leaderboards,
  form: formReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "SESSION_DESTROY") {
    state = undefined;
  }

  return reducer(state, action);
};

let store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;
