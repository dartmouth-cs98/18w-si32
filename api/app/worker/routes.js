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

workerRouter.post("/result", (req, res) => {
  console.log(req.body)
  Match.handleWorkerResponse(req.body.matchId, req.body.result, req.body.log)
  .then(() => {
    res.json({message: 'thanks bud'})
  })
  .catch(() => {
    res.status(500).json({success: false, message: "Hmm.."});
  });
})

module.exports = workerRouter;
