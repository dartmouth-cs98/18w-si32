const Router = require("koa-router");
const auth = require("../auth");

const s3 = require("../files/s3");
const { Match } = require("../models");

const { NotFoundError, MalformedError } = require("../errors");

// maximum number of games a user can create in the queue at a time
const MAX_QUEUED_GAMES = 3;
const LANDING_MATCH_ID = "5b0729d4a47a3700124c6982"

const matchRouter = Router();

// every match route requires login
// matchRouter.use(auth.loggedIn);

matchRouter.get("/", auth.loggedIn, async (ctx) => {
  // TODO this currently only returns matches that this user is part of. we'll
  // definitely need some flexible options/search ability here
  const matches = await Match.find({
    users: ctx.state.userId,
  });

  ctx.body = matches;
});

matchRouter.get("/:matchId", auth.loggedIn, async (ctx) => {
  const match = await Match.findById(ctx.params.matchId)
    .populate({ path: "bots.user", model: "User", select: "-password" })
    .populate({ path: "users", model: "User", select: "-password" }) // yes, this is a little duplicative, but it's useful
    .lean();

  if (!match) {
    throw new NotFoundError("couldn't find that match");
  }

  if (match.status == "DONE" && match.result.success == true) {
    match.logUrl = s3.getLogUrl(match.logKey);
  }

  ctx.body = match;
});

matchRouter.get("/landing", auth.noAuth, async (ctx) => {
  const match = await Match.findById(LANDING_MATCH_ID)
    .populate({ path: "bots.user", model: "User", select: "-password" })
    .populate({ path: "users", model: "User", select: "-password" })     // yes, this is a little duplicative, but it's useful
    .lean();

  if (!match) {
    throw new NotFoundError("couldn't find that match");
  }

  if (match.status == "DONE" && match.result.success == true) {
    match.logUrl = s3.getLogUrl(match.logKey);
  }

  ctx.body = match;
});

matchRouter.post("/", auth.loggedIn, async (ctx) => {
  // TODO validate that the user passed in one of their own bots
  const queuedMatches = await Match.find({
    createdBy: ctx.state.userId,
    status: "QUEUED",
  });

  if (queuedMatches.length >= MAX_QUEUED_GAMES) {
    throw new MalformedError("Wait for a game you're created to finish before starting another!");
  }

  const match = await Match.createWithBots(ctx.state.userId, ctx.request.body.botIds, { isChallenge: true });

  ctx.body = { success: true, updatedRecords: [match] };
});

module.exports = matchRouter;
