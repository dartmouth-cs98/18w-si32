const Router = require("koa-router");
const auth = require("../auth");
const s3 = require("../files/s3");
const Bot = require("../models").Bot;
const { AccessError, MalformedError } = require("../errors");
const { DEFAULT_MU, DEFAULT_SIGMA } = require("../lib/trueskill");

const botRouter = new Router();

// every bot route requires login
botRouter.use(auth.loggedIn);

botRouter.get("/", async (ctx) => {
  let bots;
  if (ctx.request.query.userId) {
    bots = await Bot.findByUser(ctx.request.query.userId);
  } else {
    bots = await Bot.find().populate("user");
  }

  ctx.body = bots;
});

botRouter.post("/", async (ctx) => {
  if (!s3.isPythonFile(ctx.request.body.files.code)) {
    throw new MalformedError("Bot must be a python file");
  }
  // const {files, fields} = await asyncBusboy(ctx.req);
  const bot = await Bot.create({
    name: ctx.request.body.fields.name,
    user: ctx.state.userId,
    trueSkill: {},
  });

  const { key } = await s3.uploadBot(ctx.state.userId, bot._id, ctx.request.body.files.code);
  bot.code = key;
  bot.versionHistory.push({ timestamp: new Date(), version: 1 });
  bot.trueSkillHistory.push({ timestamp: new Date(), score: { mu: DEFAULT_MU, sigma: DEFAULT_SIGMA } });
  bot.save();

  // delete this file to mark it as handled
  delete ctx.request.body.files.code;

  ctx.body = {
    success: true,
    updatedRecords: [bot]
  };
});

botRouter.get("/:botId", async (ctx) => {
  const bot = await Bot.findById(ctx.params.botId);

  ctx.body = bot;
});

// update bot with uploaded code
botRouter.post("/:botId", async (ctx) => {
  const bot = await Bot.findById(ctx.params.botId);

  if (ctx.state.userId != bot.user) {
    throw new AccessError("That's not your bot");
  }

  const { key } = await s3.uploadBot(ctx.state.userId, bot._id, ctx.request.body.files.code);

  // delete this file to mark it as handled
  delete ctx.request.body.files.code;

  // update bot in db w/ code's url, and increment the version
  bot.set("code", key);
  bot.set("version", bot.version + 1);
  bot.versionHistory.push({ timestamp: new Date(), version: bot.version });
  bot.save();

  ctx.body = { updatedRecords: [bot] };
});

module.exports = botRouter;
