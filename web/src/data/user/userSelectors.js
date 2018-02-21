import { createSelector } from "reselect";
import _ from "lodash";

const getSessionUser = createSelector(
  state => state.users.records,
  state => state.session.userId,
  (users, userId) => users[userId]
);

export { getSessionUser };
