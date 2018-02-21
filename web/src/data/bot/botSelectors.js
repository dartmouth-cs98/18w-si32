import { createSelector } from "reselect";
import _ from "lodash";

const getBotsForUser = createSelector(
  state => state.bots.records,
  (state, userId) => userId,
  (state, userId, options) => options || {},
  (bots, userId, options) => {
    let filteredBots = _.filter(bots, { user: userId });

    if (options.limit) {
      filteredBots = filteredBots.slice(0, options.limit);
    }

    return filteredBots;
  },
);

export { getBotsForUser };
