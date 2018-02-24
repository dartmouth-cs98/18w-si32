import { httpGetAction, httpPutAction, httpDeleteAction } from "../httpCollectionActions";

// TODO: do we still need / want this?
const fetchUsers = () => httpGetAction("USER", "/users", null);

const fetchUser = (userId, withranks) => httpGetAction("USER", `/users/${userId}`, { withranks }, { isSingle: true });

const fetchGroupRank = (groupId, userId) => httpGetAction(
  "RANK",
  `/leaderboards/rank/single/${groupId}`,
  null,
  {
    customPayloadFn: (result) => {
      return {
        ...result,
        userId,
      };
    }
  }
);


const followUser = (targetUserId) => httpPutAction("USER", `/users/follows/${targetUserId}`);
const unfollowUser = (targetUserId) => httpDeleteAction("USER", `/users/follows/${targetUserId}`);

const joinGroup = (groupId) => httpPutAction("USER", `/users/memberships/${groupId}`);
const leaveGroup = (groupId) => httpDeleteAction("USER", `/users/memberships/${groupId}`);

export {
  fetchUser,
  fetchGroupRank,
  followUser,
  unfollowUser,
  joinGroup,
  leaveGroup,
};
