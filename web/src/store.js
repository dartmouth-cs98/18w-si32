import { createStore, applyMiddleware, combineReducers } from "redux";
import logger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { reducer as formReducer } from "redux-form";

import session from "./data/session/sessionReducer";
import bots from "./data/bot/botReducer";
import users from "./data/user/userReducer";
import matches from "./data/match/matchReducer";

const reducer = combineReducers({
  session,
  bots,
  matches,
  users,
  form: formReducer,
});

let store = createStore(reducer, applyMiddleware(thunkMiddleware, logger));

export default store;
