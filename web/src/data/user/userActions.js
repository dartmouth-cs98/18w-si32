import { httpGetAction, httpPutAction, httpDeleteAction } from "../httpCollectionActions";

const fetchUser = (userId) => httpGetAction("USER", `/users/${userId}`, null, { isSingle: true });

const followUser = (targetUserId) => httpPutAction("USER", `/users/follows/${targetUserId}`);
const unfollowUser = (targetUserId) => httpDeleteAction("USER", `/users/follows/${targetUserId}`);

const joinGroup = (groupId) => httpPutAction("USER", `/users/memberships/${groupId}`);
const leaveGroup = (groupId) => httpDeleteAction("USER", `/users/memberships/${groupId}`);

export {
  fetchUser,
  followUser,
  unfollowUser,
  joinGroup,
  leaveGroup,
};
