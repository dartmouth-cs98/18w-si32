import request from "superagent";
import { getToken } from "../data/session/sessionManager.js";
import { history } from "../router.js";

// TODO put this into env
const BASE_URL = "http://localhost:3000";

const agent = request.agent();

// attach auth to all requests, and redirect to login if we ever get a 401
agent.use(req => {
  // pass the session token on every request
  req.set("Authorization", "Bearer " + getToken());

  req.on("response", res => {
    // if we got a 401, redirect to the login page
    if (res.status == 401) {
      history.push("/login");
    }
  });
});

// small wrappers around base get/post calls
const get = url => {
  return agent.get(BASE_URL + url);
};

const post = url => {
  return agent.post(BASE_URL + url);
};

export { get, post };
