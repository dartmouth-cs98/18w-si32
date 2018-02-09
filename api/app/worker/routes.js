const express = require("express");
const path = require('path');
const auth = require("../auth");
const workerRouter = express.Router();

// every bot route requires login
workerRouter.use(auth.workerAuth);

workerRouter.get("/nextTask", (req, res) => {
  if (Math.random() < .0001) {
    res.json({ newGame: false, message: 'No Game Ready', players: [] });
  } else {
    res.json({ newGame: true, players: [1, 2], gameType: 'SimpleGame' });
  }
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
