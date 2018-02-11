const express = require("express");
const auth = require("../auth");
const s3 = require("../s3");
const Bot = require("./model");

const botRouter = express.Router();

// every bot route requires login
botRouter.use(auth.loggedIn);

botRouter.get("/", (req, res) => {
  Bot.find({
    user: req.userId,
  })
  .then((bots) => {
    res.send(bots);
  });
  // TODO error handle
});

botRouter.post("/new", (req, res) => {
  // upload the code first
  s3.uploadBot(req.userId, req.body.name, req.files.code).then(({ url, key }) => {
    // put the bot in db w/ the code's url
    return Bot.create({
      name: req.body.name,
      user: req.userId,
      code: {
        url,
        key
      }
    });
  })
  .then((bot) => {
    res.send({
      success: true,
      bot
    });
  })
  .catch((err) => {
    res.status(400).send({ success: false, message: "couldn't create your bot", err });
  });
});

module.exports = botRouter;
