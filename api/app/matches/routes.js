const express = require("express");
const _ = require("lodash");
const auth = require("../auth");
const s3 = require("../s3");
const Match = require("./model");
const Bot = require("../bots/model");


const matchRouter = express.Router();

// every bot route requires login
matchRouter.use(auth.loggedIn);

matchRouter.get("/", (req, res) => {
  Match.find({
    users: req.userId,
  })
  .select({ log: 0 })
  .then((matches) => {
    res.send(matches);
  });
  // TODO error handle
});

matchRouter.post("/new", (req, res) => {
  // TODO validate that the user passed in one of their own bots
  Match.createWithBots(req.userId, req.body.botIds)
  .then(match => {
    res.send({ success: true, match });
  })
  .catch(err => {
    res.status(400).send({ success: false, err });
  });
});

module.exports = matchRouter;
