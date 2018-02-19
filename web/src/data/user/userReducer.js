import httpCollectionReducer from "../httpCollectionReducer";

const userReducer = httpCollectionReducer("USER", (state) => {
  // implement any non-standard collection reducers here
  return state;
});

export default userReducer;
