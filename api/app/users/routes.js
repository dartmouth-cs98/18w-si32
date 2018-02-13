const Router = require("koa-router");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const session = require("../session");
const auth = require("../auth");
const User = require("./model");

const userRouter = Router();

// TODO split handlers into independent places?

userRouter.post("/register", async (ctx, next) => {
  // hash the password
  const hash = await bcrypt.hash(ctx.request.body.password, 10);

  const u = await User.create({
    // create the user in the db
    username: ctx.request.body.username,
    password: hash
  });

  const s = await session.create(u, ctx.ip);
  ctx.body = {
    created: true,
    session: s
  };

  return next();
});

userRouter.post("/login", async (ctx, next) => {
  const user = await User.findOne({ username: ctx.request.body.username });

  if (!user) {
    throw new Error();
  }
  const match = await bcrypt.compare(ctx.request.body.password, user.password);

  if (!match) {
    throw new Error();
  }

  const s = await session.create(user, ctx.ip);

  ctx.body = {
    session: s,
  };

  return next();
});

userRouter.post("/logout", auth.loggedIn, async (ctx, next) => {
  await session.destroy(ctx.token);

  ctx.body = {
    success: true
  };
});

// placeholder simple authed profile endpoint
userRouter.get("/profile", auth.loggedIn, async (ctx, next) => {
  ctx.body = { user: ctx.userId };
  return next();
});

module.exports = userRouter;
