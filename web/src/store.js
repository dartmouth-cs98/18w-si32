import { createStore, applyMiddleware, combineReducers } from "redux";
import logger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import session from "./data/session/sessionReducer";

const reducer = combineReducers({
  session
});

let store = createStore(reducer, applyMiddleware(thunkMiddleware, logger));

export default store;
