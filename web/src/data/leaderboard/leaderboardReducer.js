import httpCollectionReducer from "../httpCollectionReducer";
import {
  SET_SELECTED_GROUP
} from "./leaderboardActions";

const leaderboardReducer = httpCollectionReducer("LEADERBOARD", (state, action) => {
  // implement any non-standard collection reducers here
  switch(action.type) {
    case SET_SELECTED_GROUP:
      return {
        ...state,
        selectedGroup: action.payload
      };
    default:
      return state;
  }
});

export default leaderboardReducer;
