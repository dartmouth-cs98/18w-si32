const Router = require("koa-router");
const auth = require("../auth");
const Match = require("../models").Match;

const workerRouter = Router();

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

  /* eslint-disable node/no-unsupported-features */
  ctx.body = {
    newGame: true,
    ...match
  };
  /* eslint-enable node/no-unsupported-features */

  return next();
});

workerRouter.post("/result", async (ctx, next) => {
  /* eslint-disable no-unused-vars */
  const matchResult = await Match.handleWorkerResponse(ctx.request.body.matchId, ctx.request.body.result, ctx.request.body.gameOutput);
  /* eslint-disable no-unused-vars */

  ctx.body = {message: "thanks bud"};
  return next();
});

module.exports = workerRouter;
