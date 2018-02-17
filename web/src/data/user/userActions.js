import * as http from "../../util/http";
import { httpGetAction, httpPutAction, httpDeleteAction } from "../httpCollectionActions";

const getProfile = () => {
  return http.get("/users/profile").then(res => res.body);
};

// TODO this needs search capability
const fetchUsers = () => httpGetAction("USER", "/users", null);

const followUser = (targetUserId) => httpPutAction("USER", `/users/follows/${targetUserId}`);
const unfollowUser = (targetUserId) => httpDeleteAction("USER", `/users/follows/${targetUserId}`);

export {
  fetchUsers,
  followUser,
  unfollowUser,
  getProfile,
};
