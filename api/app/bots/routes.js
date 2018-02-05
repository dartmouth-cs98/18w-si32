const express = require("express");
const auth = require("../auth");
const botRouter = express.Router();

// every bot route requires login
botRouter.use(auth.loggedIn);

botRouter.get("/", (req, res) => {
  res.send({ name: "bot", user: req.userId });
});

module.exports = botRouter;
