import httpCollectionReducer from "../httpCollectionReducer";

/* eslint-disable no-unused-vars */
// TODO: action creating eslint error here because it is not used,
// do we need it?

const matchReducer = httpCollectionReducer("MATCH", (state, action) => {
  return state;
});

export default matchReducer;
