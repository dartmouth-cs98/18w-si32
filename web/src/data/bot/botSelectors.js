import { createSelector } from "reselect";
import _ from "lodash";

const getBotsForUser = createSelector(
  state => state.bots.records,
  (state, userId) => userId,
  (bots, userId) => {
    console.log(bots, userId);
    return _.filter(bots, { user: userId });
  }
);

export { getBotsForUser };
