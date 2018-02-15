import httpCollectionReducer from "../httpCollectionReducer";

/* eslint-disable no-unused-vars */
// TODO: action creating eslint error here because it is not used,
// do we need it?

const botReducer = httpCollectionReducer("BOT", (state, action) => {
  // implement any non-standard collection reducers here
  return state;
});

export default botReducer;
