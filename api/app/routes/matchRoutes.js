const Router = require("koa-router");
const _ = require("lodash");
const auth = require("../auth");
const s3 = require("../files/s3");
const { Bot, Match } = require("../models");


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

matchRouter.post("/", async (ctx) => {
  // TODO validate that the user passed in one of their own bots
  const match = await Match.createWithBots(ctx.state.userId, ctx.request.body.botIds);

  ctx.body = { success: true, updatedRecords: [match] };
});

module.exports = matchRouter;
