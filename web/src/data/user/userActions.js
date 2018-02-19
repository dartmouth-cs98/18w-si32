import { httpGetAction, httpPutAction, httpDeleteAction } from "../httpCollectionActions";

// TODO: do we still need / want this?
const fetchUsers = () => httpGetAction("USER", "/users", null);

const fetchUser = (userId) => httpGetAction("USER", `/users/${userId}`, null, { isSingle: true });

const followUser = (targetUserId) => httpPutAction("USER", `/users/follows/${targetUserId}`);
const unfollowUser = (targetUserId) => httpDeleteAction("USER", `/users/follows/${targetUserId}`);

export {
  fetchUsers,
  fetchUser,
  followUser,
  unfollowUser,
};
