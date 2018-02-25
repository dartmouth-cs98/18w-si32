import * as http from "../../util/http";

// GET users, constrained by search query (currently only queries on username)
const getUsersForSearch = (query) => {
  const q = { q: query };
  return http.get("/users")
    .query(q)
    .then(res => res.body)
    .catch(err => {
      // TODO: what to do here?
      console.log("HTTP error", "/user", endpoint, query, err); // eslint-disable-line
    });
};

export {
  getUsersForSearch,
};
