import httpCollectionReducer from "../httpCollectionReducer";

const userReducer = httpCollectionReducer("USER", (state, action) => {
  // implement any non-standard collection reducers here
  switch (action.type) {
    case "RECEIVED_RANK":
      if (!action.payload.userId) {
        return state;
      } else {
        return {
          ...state,
          records: {
            ...state.records,
            [action.payload.userId]: {
              ...state.records[action.payload.userId],
              ranks: {
                ...state.records[action.payload.userId].ranks,
                [action.payload._id]: action.payload.rank,
              }
            }
          }
        };
      }
    default:
      return state;
  }
});

export default userReducer;
