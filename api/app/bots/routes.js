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
  })
  .catch(() => {
    res.status(500).send([]);
  });
});

botRouter.post("/new", (req, res) => {
  Bot.create({
    name: req.body.name,
    user: req.userId,
  })
  .then((bot) => {
    // upload the code async. Better to return faster and do the 2 db calls than
    // wait for code to make it to s3 before responding. Also, want an id to use as
    // key for the bot's code, so that there are no filename collisions
    // TODO need some error handling/retrying here
    s3.uploadBot(req.userId, bot._id, req.files.code).then(({ url, key }) => {
      // update bot in db w/ code's url
      bot.set("code", { url, key });
      bot.save();
    });

    res.send({
      success: true,
      bot
    });
  })
  .catch((err) => {
    res.status(400).send({ success: false, message: "couldn't create your bot", err });
  });
});

// update bot with uploaded code
botRouter.post("/:botId", (req, res) => {
  console.log("handling");
  Bot.findById(req.params.botId).then(bot => {
    return s3.uploadBot(req.userId, bot._id, req.files.code).then(({ url, key }) => {
      // update bot in db w/ code's url
      bot.set("code", { url, key });
      bot.set("version", bot.version + 1);
      bot.save();
      res.send({ bot });
    });
  })
  .catch(err => {
    console.log("error", err);
    res.status(500).send({ err });
  });
});

module.exports = botRouter;
