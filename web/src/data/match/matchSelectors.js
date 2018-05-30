import { createSelector } from "reselect";
import _ from "lodash";

// TODO: make less ugly
const getMatchesForUser = createSelector(
  state => state.matches.records,
  (state, userId) => userId,
  (state, userId, limit) => limit || 15,
  (matches, userId, limit) => {
    if (limit == -1) {
      limit = 150;
    }

    return _.reverse(
      _.sortBy(
        _.filter(matches, (m) => _.includes(m.users, userId) && m.status == "DONE" ), 
        "updatedAt"
      )
    ).slice(0, limit);
  }
  
);


export { getMatchesForUser };
