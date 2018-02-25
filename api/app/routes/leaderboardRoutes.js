const Router = require("koa-router");
const mongoose = require("mongoose");

const auth = require("../auth");

const { leaderboardQuery, rankingQuery, allRanksQuery } = require("./leaderboardQueries");

const leaderboardRouter = Router();

const LEADERBOARD_PAGE_SIZE = 20;

/**
 * @api GET path /:groupId
 * Get leaderboard for a specific group
 */
leaderboardRouter.get("/:groupId?", auth.loggedIn, async (ctx) => {
  const groupId = mongoose.Types.ObjectId.isValid(ctx.params.groupId) ? ctx.params.groupId : "global";
  const {users, userCount} = await leaderboardQuery({groupId: groupId, page: ctx.query.page});
  const numPages = Math.ceil(userCount / LEADERBOARD_PAGE_SIZE);

  ctx.body = {
    _id: groupId,
    users,
    numPages,
  };
});

/**
 * @api GET path /rank/group/:groupId?
 * Get rank for a single group. Supply no groupId to get global rank
 */
leaderboardRouter.get("/rank/single/:groupId?", auth.loggedIn, async (ctx) => {
  const groupId = mongoose.Types.ObjectId.isValid(ctx.params.groupId) ? ctx.params.groupId : "global";
  const rank = await rankingQuery({groupId: groupId, userId: ctx.state.userId});

  ctx.body = {
    _id: groupId,
    rank
  };
});

/**
 * @api GET path /rank/group/:groupId?
 * Get rank for a single group. Supply no groupId to get global rank
 */
leaderboardRouter.get("/rank/all", auth.loggedIn, async (ctx) => {
  ctx.body = await allRanksQuery(ctx.state.userId);
});


module.exports = leaderboardRouter;
