const express = require("express");
const path = require('path');
const auth = require("../auth");
const Match = require("../matches/model");

const workerRouter = express.Router();

// every bot route requires login
workerRouter.use(auth.workerAuth);

workerRouter.get("/nextTask", (req, res) => {
  // TODO need some way to revert back to QUEUED if we dont get results
  // for some reason (worker crashed, etc.)
  Match.getNext()
  .then(match => {
    if (!match) {
      return res.json({
        newGame: false,
        message: "No game",
      });
    }

    res.json({
      newGame: true,
      ...match
    });
  });
});

workerRouter.get("/file/:id", (req, res) => {
  // TODO: this should obviously be fetching a bot from the database, not one stored in the file system.
  res.sendFile(`bot${req.params.id}.py`, {root: path.join(__dirname, '../../public')})
  // res.sendFile('index.html', { root: __dirname });
});

workerRouter.post("/result", (req, res) => {
  console.log(req.body)
  res.json({message: 'thanks bud'})
})

module.exports = workerRouter;
