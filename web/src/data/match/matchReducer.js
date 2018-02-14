import httpCollectionReducer from "../httpCollectionReducer";

const matchReducer = httpCollectionReducer("MATCH", (state, action) => {
  return state;
});

export default matchReducer;
