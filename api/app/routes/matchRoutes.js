const Router = require("koa-router");
const auth = require("../auth");

const s3 = require("../files/s3");
const { Match } = require("../models");

const { NotFoundError } = require("../errors");

const matchRouter = Router();

// every match route requires login
matchRouter.use(auth.loggedIn);

matchRouter.get("/", async (ctx) => {
  // TODO this currently only returns matches that this user is part of. we'll
  // definitely need some flexible options/search ability here
  const matches = await Match.find({
    users: ctx.state.userId,
  });

  ctx.body = matches;
});

matchRouter.get("/:matchId", async (ctx) => {
  const match = await Match.findById(ctx.params.matchId).lean();

  if (!match) {
    throw new NotFoundError("couldn't find that match");
  }

  if (match.status == "DONE") {
    match.logUrl = s3.getLogUrl(match.logKey);
  }

  ctx.body = match;
});

matchRouter.post("/", async (ctx) => {
  // TODO validate that the user passed in one of their own bots
  const match = await Match.createWithBots(ctx.state.userId, ctx.request.body.botIds);

  ctx.body = { success: true, updatedRecords: [match] };
});

module.exports = matchRouter;
