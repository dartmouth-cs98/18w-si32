const Router = require("koa-router");
const _ = require("lodash");
const auth = require("../auth");
const s3 = require("../s3");
const Match = require("./model");
const Bot = require("../bots/model");


const matchRouter = Router();

// every match route requires login
matchRouter.use(auth.loggedIn);

matchRouter.get("/", async (ctx, next) => {
  // TODO this currently only returns matches that this user is part of. we'll
  // definitely need some flexible options/search ability here
  const matches = await Match.find({
    users: ctx.userId,
  });

  ctx.body = matches;

  return next();
});

matchRouter.post("/", async (ctx, next) => {
  // TODO validate that the user passed in one of their own bots
  const match = await Match.createWithBots(ctx.userId, ctx.request.body.botIds);

  ctx.body = { success: true, updatedRecords: [match] };

  return next();
});

module.exports = matchRouter;
