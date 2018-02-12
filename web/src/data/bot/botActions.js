import * as http from "../../util/http.js";
import { httpGetAction } from "../httpCollectionActions";
import history from "../../history";

const fetchBots = () => httpGetAction("BOT", "/bots", null);

const createBot = (name, code) => (dispatch, getState) => {
  return http
    .post("/bots")
    .field("name", name)
    .field("code", code)
    .then(res => {
      // push the new bot into the store
      dispatch({
        type: "RECEIVED_BOT",
        doMerge: true,
        payload: res.body.updatedRecords,
      });

      history.push(`/bots/${res.body.bot._id}`);
    }).catch(err => {
      console.log("err AFTER upload attempt", err);
    });
};

const updateBotCode = (botId, code) => (dispatch, getState) => {
  return http
    .post(`/bots/${botId}`)
    .field("id", botId)
    .field("code", code)
    .then(res => {
      // push the updated bot into the store
      dispatch({
        type: "RECEIVED_BOT",
        doMerge: true,
        payload: res.body.updatedRecords,
      });
    }).catch(err => {
      console.log("err AFTER upload attempt", err);
    });
};

export { createBot, updateBotCode, fetchBots };
