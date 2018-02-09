import * as http from "../../util/http.js";

const CREATE_BOT = "CREATE_BOT";


const createBot = (name, code) => (dispatch, getState) => {
  console.log("created bot");
  return http
    .post("/bots/new")
    .field("name", name)
    .then(res => {
      console.log("success AFTER upload attempt", res);
    }).catch(err => {
      console.log("err AFTER upload attempt", err);
    });
};

export { createBot };
