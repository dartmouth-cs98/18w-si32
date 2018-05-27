import * as http from "../../util/http.js";
import { httpGetAction } from "../httpCollectionActions";
import history from "../../history";

/* eslint-disable no-unused-vars */

const fetchBots = (userId) => httpGetAction("BOT", "/bots", { userId });

const fetchBot = (botId) => httpGetAction("BOT", `/bots/${botId}`, null, { isSingle: true });

const createBot = (name, code, params) => (dispatch, getState) => {
  if (!name) {
    return Promise.reject("Need to name your bot");
  }
  if (!code) {
    return Promise.reject("Choose your bot's python file");
  }

  return http
    .post("/bots")
    .field("name", name)
    .field("code", code)
    .field("params", JSON.stringify(params))
    .then(res => {
      // push the new bot into the store
      dispatch({
        type: "RECEIVED_BOT",
        doMerge: true,
        payload: res.body.updatedRecords,
      });

      // TODO: this probably should live elsewhere in code
      // TODO: add this back in at some point?
      // history.push(`/bots/${res.body.updatedRecords[0]._id}`);
    });
};

const updateBot = (botId, code, params=[]) => (dispatch, getState) => {
  if (!code) {
    code = "";
  }

  return http
    .post(`/bots/${botId}`)
    .field("id", botId)
    .field("code", code)
    .field("params", JSON.stringify(params))
    .then(res => {
      // push the updated bot into the store
      dispatch({
        type: "RECEIVED_BOT",
        doMerge: true,
        payload: res.body.updatedRecords,
      });
    });
};

export {
  createBot,
  fetchBot,
  fetchBots,
  updateBot,
};
