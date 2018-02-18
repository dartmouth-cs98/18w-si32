const Router = require("koa-router");
const bcrypt = require("bcryptjs");

const session = require("../session");
const auth = require("../auth");
const User = require("../models").User;

const { AuthError } = require("../errors");

const userRouter = Router();

/**
 * @api GET path /users
 * Get users with username similar to query (username contains query as subtring). 
 */
userRouter.get("/", auth.loggedIn, async (ctx) => {
  let users;
  if (ctx.query.q) {
    users = await User.find({ "username": { "$regex": `${ctx.query.q}`, "$options": "i" } });
  } else {
    // TODO: probably dont want to be doing a find on all users in the event there is no query...
    // what do we want to do here? 
    users = await User.find();
  }
  ctx.body = users;
});

/**
 * @api GET path /users/:userId 
 * Get a single user by ID. 
 */
userRouter.get("/:userId", auth.loggedIn, async (ctx) => {
  let user = await User.findById(ctx.params.userId);
  ctx.body = user;
});

// trying to be RESTful here. Imagine we're creating some "follows" resource/link
// from logged in user to targetUserId, which is passed in the body.
userRouter.put("/follows/:targetUserId", auth.loggedIn, async (ctx) => {
  let user = await User.findById(ctx.state.userId);

  let { userFrom, userTo } = await user.follow(ctx.params.targetUserId);

  ctx.body = {
    updatedRecords: [userFrom, userTo],
  };
});

// trying to be RESTful here. Imagine we're creating some "follows" resource/link
// from logged in user to targetUserId, which is passed in the body.
userRouter.delete("/follows/:targetUserId", auth.loggedIn, async (ctx) => {
  let user = await User.findById(ctx.state.userId);

  let { userFrom, userTo } = await user.unfollow(ctx.params.targetUserId);

  ctx.body = {
    updatedRecords: [userFrom, userTo],
  };
});

// placeholder simple authed profile endpoint
userRouter.get("/profile", auth.loggedIn, async (ctx) => {
  ctx.body = { user: ctx.state.userId };
});


// TODO split handlers into independent places?
userRouter.post("/register", async (ctx) => {
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
    session: {
      token: s.token,
      userId: u._id,
    },
    user: u
  };
});

userRouter.post("/login", async (ctx) => {
  const user = await User.findOne({ username: ctx.request.body.username });

  if (!user) {
    throw new AuthError("Couldn't log you in with those credentials");
  }

  const match = await bcrypt.compare(ctx.request.body.password, user.password);

  if (!match) {
    throw new AuthError("Couldn't log you in with those credentials");
  }

  const s = await session.create(user, ctx.ip);

  ctx.body = {
    session: {
      token: s.token,
      userId: user._id,
    },
    user: user
  };
});

userRouter.post("/logout", auth.loggedIn, async (ctx) => {
  await session.destroy(ctx.state.token);

  ctx.body = {};
});

module.exports = userRouter;
