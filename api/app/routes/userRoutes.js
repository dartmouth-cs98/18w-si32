const Router = require("koa-router");
const bcrypt = require("bcryptjs");
const assert = require("assert");
const _ = require("lodash");

const session = require("../session");
const auth = require("../auth");
const User = require("../models").User;
const Group = require("../models").Group;

const { allRanksQuery } = require("./leaderboardQueries");
const { AuthError, MalformedError } = require("../errors");

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
  const getProms = [
    User.findById(ctx.params.userId).populate("groups"),
  ];

  if (ctx.query.withranks) {
    getProms.push(allRanksQuery(ctx.params.userId));
  }

  if (ctx.query.withFollows === "true") {
    getProms[0] = getProms[0].populate("following").populate("followers");
  }


  let [user, ranks] = await Promise.all(getProms);
  user._doc.ranks = ranks || {};

  ctx.body = user;
});

/**
 * @api PUT path /users/onboard
 * Mark a user as having completed onboarding.
 */
userRouter.put("/onboard", auth.loggedIn, async (ctx) => {
  let user = await User.onboard(ctx.state.userId);
  ctx.body = {
    updatedRecords: [user]
  };
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

// trying to be RESTful here. Imagine we're creating some "is member" resource/link
// from logged in user to targetGroupId, which is passed in the body.
userRouter.put("/memberships/:targetGroupId", auth.loggedIn, async (ctx) => {
  let toJoin = await Group.findById(ctx.params.targetGroupId);

  if (!toJoin) {
    throw new MalformedError(`Group with id ${ctx.params.targetGroupId} does not exist`);
  }

  let { user } = await toJoin.addMember(ctx.state.userId);

  ctx.body = {
    updatedRecords: [user],
  };
});

// trying to be RESTful here. Imagine we're deleting some "is member" resource/link
// from logged in user to targetGroupId, which is passed in the body.
userRouter.delete("/memberships/:targetGroupId", auth.loggedIn, async (ctx) => {
  let toJoin = await Group.findById(ctx.params.targetGroupId);

  if (!toJoin) {
    throw new MalformedError(`Group with id ${ctx.params.targetGroupId} does not exist`);
  }

  let { user } = await toJoin.removeMember(ctx.state.userId);

  ctx.body = {
    updatedRecords: [user],
  };
});

// placeholder simple authed profile endpoint
userRouter.get("/profile", auth.loggedIn, async (ctx) => {
  ctx.body = { user: ctx.state.userId };
});


// TODO split handlers into independent places?
userRouter.post("/register", async (ctx) => {
  assert(_.get(ctx, "request.body.username", "").length > 0, "You need to enter a username");
  assert(_.get(ctx, "request.body.password", "").length > 0, "You need to enter a password");

  // check for existing user with username
  const existingUser = await User.findOne({ username: ctx.request.body.username });
  if (existingUser) {
    throw new MalformedError("A user already exists with that username");
  }

  // hash the password
  const hash = await bcrypt.hash(ctx.request.body.password, 10);

  const u = await User.create({
    // create the user in the db
    username: ctx.request.body.username,
    password: hash,
    trueSkill: {}
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

// IDEA: aggegation that filters users out by group, and counts at every step. But have to reset to all users somehow
// before each filter
// first match only all users that are before the user. then do a grouping for `each` group the user is in,
// and then just count the groupings. each group has _id as userid being in the member group

module.exports = userRouter;
