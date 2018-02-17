import * as http from "../../util/http";
import { httpGetAction, httpPutAction, httpDeleteAction } from "../httpCollectionActions";

const getProfile = () => {
  return http.get("/users/profile").then(res => res.body);
};

const getUsersForSearch = (query) => {
  const q = { q: query }
  return http.get("/users")
    .query(q)
    .then(res => res.body)
    .catch(err => {
      // TODO: what to do here?
      console.log("HTTP error", "/user", endpoint, query, err); // eslint-disable-line
    });
}

const fetchUsers = (userQuery) => httpGetAction("USER", "/users", { userQuery: userQuery });

const followUser = (targetUserId) => httpPutAction("USER", `/users/follows/${targetUserId}`);
const unfollowUser = (targetUserId) => httpDeleteAction("USER", `/users/follows/${targetUserId}`);

export {
  fetchUsers,
  followUser,
  unfollowUser,
  getProfile,
  getUsersForSearch,
};
