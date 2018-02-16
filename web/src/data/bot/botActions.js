import * as http from "../../util/http.js";
import { httpGetAction } from "../httpCollectionActions";
import history from "../../history";

/* eslint-disable no-unused-vars */
// TODO: getState creating eslint error here because it is not used,
// do we need it?

const fetchBots = (userId) => httpGetAction("BOT", "/bots", { userId });

const fetchBot = (userId) => httpGetAction("BOT", `/bots/${userId}`, { userId }, { isSingle: true });

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

      // TODO this probably should live elsewhere in code
      history.push(`/bots/${res.body.updatedRecords[0]._id}`);
    }).catch(err => {
      /* eslint-disable no-console */
      console.log("err AFTER upload attempt", err);
      /* eslint-enable no-console */
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
      /* eslint-disable no-console */
      console.log("err AFTER upload attempt", err);
      /* eslint-enable no-console */
    });
};

export {
  createBot,
  fetchBot,
  fetchBots,
  updateBotCode,
};
