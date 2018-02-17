import { createSelector } from "reselect";
import _ from "lodash";

const getMatchesForUser = createSelector(
  state => state.matches.records,
  (state, userId) => userId,
  (matches, userId) => _.filter(matches, (m) => _.includes(m.users, userId)),
);

export { getMatchesForUser };
