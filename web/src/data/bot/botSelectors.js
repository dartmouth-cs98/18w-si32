import { createSelector } from "reselect";
import _ from "lodash";

const getBotsForUser = createSelector(
  state => state.bots.records,
  (state, userId) => userId,
  (bots, userId) => _.filter(bots, { user: userId }),
);

export { getBotsForUser };
