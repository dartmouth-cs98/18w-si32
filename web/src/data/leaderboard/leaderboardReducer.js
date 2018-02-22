import httpCollectionReducer from "../httpCollectionReducer";

const leaderboardReducer = httpCollectionReducer("LEADERBOARD", (state) => {
  // implement any non-standard collection reducers here
  return state;
});

export default leaderboardReducer;
