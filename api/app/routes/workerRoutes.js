const Router = require("koa-router");
const zlib = require("zlib");
const util = require("util");
const msgpack = require("msgpack-lite");
const fs = require("fs");
const s3 = require("../files/s3");
const auth = require("../auth");
const Match = require("../models").Match;
const socket = require("../lib/socket");

const workerRouter = Router();

const readFile = util.promisify(fs.readFile);

// every bot route requires login
workerRouter.use(auth.workerAuth);

workerRouter.get("/nextTask", async (ctx, next) => {
  // TODO need some way to revert back to QUEUED if we dont get results
  // for some reason (worker crashed, etc.)
  const match = await Match.getNext();

  if (!match) {
    ctx.body ={
      newGame: false,
      message: "No game",
    };
    return next();
  }
  
  // inform frontend via the socket that the game is now running
  socket.matchStarted(match.id);

  /* eslint-disable node/no-unsupported-features */
  ctx.body = {
    newGame: true,
    ...match
  };
  /* eslint-enable node/no-unsupported-features */

  return next();
});

workerRouter.post("/result/:matchId", async (ctx, next) => {
  /* eslint-disable no-unused-vars */
  const matchId = ctx.params.matchId;

  // read the log file
  const logData = await readFile(ctx.request.body.files.log.path);

  // unzip it
  zlib.unzip(logData, async (err, res) => {
    const gameOutput = msgpack.decode(res); // ... finally unpack it

    // this is the key where the log _will_ live, even though it's not uploaded yet
    // we don't want to have to upload first and then delete from s3 if db update fails
    const logKey = `${matchId}.mp`;

    // update the match in the db
    const matchResult = await Match.handleWorkerResponse(matchId, gameOutput.rankedBots, logKey, { success: true });

    // if that was all successful, put the log in s3
    await s3.uploadLog(matchId, logData);

    // inform frontend via the socket that the game is done
    socket.matchResults(matchId);

    ctx.body = {message: "thanks bud"};
    return next();

  });
  /* eslint-disable no-unused-vars */

});

// ugly to use another route but it's just easier; this will handle timeouts, crashes, etc.
workerRouter.post("/failed/:matchId", async (ctx, next) => {
  /* eslint-disable no-unused-vars */
  const matchId = ctx.params.matchId;

  // update the match in the db
  const matchResult = await Match.handleWorkerResponse(matchId, ctx.request.body.rankedBots, null, ctx.request.body.result);

  return next();
  /* eslint-disable no-unused-vars */
});

module.exports = workerRouter;
