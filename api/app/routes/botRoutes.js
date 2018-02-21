const Router = require("koa-router");
const auth = require("../auth");
const s3 = require("../files/s3");
const Bot = require("../models").Bot;
const { AccessError } = require("../errors");

const botRouter = new Router();

// every bot route requires login
botRouter.use(auth.loggedIn);

botRouter.get("/", async (ctx) => {
  let bots;
  if (ctx.request.query.userId) {
    bots = await Bot.findByUser(ctx.request.query.userId);
  } else {
    bots = await Bot.find();
  }

  ctx.body = bots;
});

botRouter.post("/", async (ctx) => {
  // const {files, fields} = await asyncBusboy(ctx.req);
  const bot = await Bot.create({
    name: ctx.request.body.fields.name,
    user: ctx.state.userId,
    trueSkill: {},
  });

  // upload the code async. Better to return faster and do the 2 db calls than
  // wait for code to make it to s3 before responding. Also, want an id to use as
  // key for the bot's code, so that there are no filename collisions
  // TODO need some error handling/retrying here
  s3.uploadBot(ctx.state.userId, bot._id, ctx.request.body.files.code).then(({ key }) => {
    // update bot in db w/ code's url
    bot.set("code", key);
    bot.save();
  });

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
  // TODO validate that user owns this bot
  const bot = await Bot.findById(ctx.params.botId);

  if (ctx.state.userId != bot.user) {
    throw new AccessError("That's not your bot");
  }

  const { key } = await s3.uploadBot(ctx.state.userId, bot._id, ctx.request.body.files.code);

  // delete this file to mark it as handled
  delete ctx.request.body.files.code;

  // update bot in db w/ code's url
  bot.set("code", key);
  bot.set("version", bot.version + 1);
  bot.save();

  ctx.body = { updatedRecords: [bot] };
});

module.exports = botRouter;
