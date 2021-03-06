const Router = require("koa-router");
const _ = require("lodash");
const auth = require("../auth");
const s3 = require("../files/s3");
const Bot = require("../models").Bot;
const User = require("../models").User;
const { AccessError, MalformedError } = require("../errors");
const { DEFAULT_MU, DEFAULT_SIGMA, USER_SIGMA_ADJUST, BOT_SIGMA_ADJUST } = require("../lib/trueskill");

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

  const params = JSON.parse(ctx.request.body.fields.params);
  const cleanParams = Bot.cleanParams(params);

  const bot = await Bot.create({
    name: ctx.request.body.fields.name,
    user: ctx.state.userId,
    trueSkill: {},
    params: cleanParams,
  });

  const { key } = await s3.uploadBot(ctx.state.userId, bot._id, ctx.request.body.files.code);
  bot.code = key;
  bot.versionHistory.push({ timestamp: new Date(), version: 1 });
  bot.trueSkillHistory.push({ timestamp: new Date(), score: { mu: DEFAULT_MU, sigma: DEFAULT_SIGMA } });
  await bot.save();

  await bot.populate("user").execPopulate();

  // update the user's sigma
  const user = await User.findById(ctx.state.userId);
  user.trueSkill.sigma = user.trueSkill.sigma * USER_SIGMA_ADJUST; 
  await user.save();

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
  
  const params = JSON.parse(ctx.request.body.fields.params);
  const cleanParams = Bot.cleanParams(params);

  if (ctx.state.userId != bot.user) {
    throw new AccessError("That's not your bot");
  }

  // if there's new code, upload and update with it 
  if (!_.isEmpty(ctx.request.body.files.code)) {
    const { key } = await s3.uploadBot(ctx.state.userId, bot._id, ctx.request.body.files.code);

    // delete this file to mark it as handled
    delete ctx.request.body.files.code;
    
    // update bot in db w/ code's url, and increment the version
    bot.set("code", key);
  }

  // set params for bot
  bot.set("params", cleanParams);


  bot.set("version", bot.version + 1);
  bot.versionHistory.push({ timestamp: new Date(), version: bot.version });
  bot.trueSkill.sigma = bot.trueSkill.sigma * BOT_SIGMA_ADJUST;
  bot.save();
  
  // update the user's sigma
  const user = await User.findById(ctx.state.userId);
  user.trueSkill.sigma = user.trueSkill.sigma * USER_SIGMA_ADJUST; 
  await user.save();

  ctx.body = { updatedRecords: [bot] };
});

module.exports = botRouter;
