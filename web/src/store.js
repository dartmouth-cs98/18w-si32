import { createStore, applyMiddleware, combineReducers } from "redux";
import logger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import session from "./data/session/sessionReducer";
import bots from "./data/bot/botReducer";

const reducer = combineReducers({
  session,
  bots
});

let store = createStore(reducer, applyMiddleware(thunkMiddleware, logger));

export default store;
