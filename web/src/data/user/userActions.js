import * as http from "../../util/http";
import { httpGetAction } from "../httpCollectionActions";

const getProfile = () => {
  return http.get("/users/profile").then(res => res.body);
};

// TODO this needs search capability
const fetchUsers = () => httpGetAction("USER", "/users", null);

export {
  fetchUsers,
  getProfile,
};
