import httpCollectionReducer from "../httpCollectionReducer";

const botReducer = httpCollectionReducer("BOT", (state, action) => {
  // implement any non-standard collection reducers here
  return state;
});

export default botReducer;
