import * as http from "../../util/http.js";
import { httpGetAction } from "../httpCollectionActions";
import history from "../../history";

const fetchBots = () => httpGetAction("BOT", "/bots", null);

const createBot = (name, code) => (dispatch, getState) => {
  return http
    .post("/bots/new")
    .field("name", name)
    .field("code", code)
    .then(res => {
      // push the new bot into the store
      dispatch({
        type: "RECEIVED_BOT",
        doMerge: true,
        payload: [res.body.bot],
      });

      history.push("/bots");
      console.log("success AFTER upload attempt", res);
    }).catch(err => {
      console.log("err AFTER upload attempt", err);
    });
};

export { createBot, fetchBots };
