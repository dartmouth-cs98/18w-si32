import { createSelector } from "reselect";
import _ from "lodash";

// TODO: make less ugly
const getMatchesForUser = createSelector(
  state => state.matches.records,
  (state, userId) => userId,
  (matches, userId) => _.reverse(_.sortBy(_.filter(matches, (m) => _.includes(m.users, userId) && m.status == "DONE" ), "updatedAt")),
);

export { getMatchesForUser };
