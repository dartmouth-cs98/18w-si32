import { httpGetAction, httpPutAction, httpDeleteAction } from "../httpCollectionActions";

// TODO: do we still need / want this?
const fetchUsers = () => httpGetAction("USER", "/users", null);

const followUser = (targetUserId) => httpPutAction("USER", `/users/follows/${targetUserId}`);
const unfollowUser = (targetUserId) => httpDeleteAction("USER", `/users/follows/${targetUserId}`);

export {
  fetchUsers,
  followUser,
  unfollowUser,
};
