import { createSelector } from "reselect";

const getSessionUser = createSelector(
  state => state.users.records,
  state => state.session.userId,
  (users, userId) => users[userId]
);

export { getSessionUser };
