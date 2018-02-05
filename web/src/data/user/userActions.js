import * as http from "../../util/http.js";

const getProfile = () => {
  return http.get("/users/profile").then(res => res.body);
};

export { getProfile };
