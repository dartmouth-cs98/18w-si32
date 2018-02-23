const Router = require("koa-router");

const auth = require("../auth");
const Group = require("../models").Group;
const User = require("../models").User;

const { MalformedError } = require("../errors");

const leaderboardRouter = Router();

const LEADERBOARD_PAGE_SIZE = 20;

/**
 * @api GET path /:groupId
 * Get leaderboard for a specific group
 */
leaderboardRouter.get("/:groupId?", auth.loggedIn, async (ctx) => {
  const {users, userCount} = await leaderboardQuery({groupId: ctx.params.groupId, page: ctx.query.page});
  const numPages = Math.ceil(userCount / LEADERBOARD_PAGE_SIZE);

  ctx.body = {
    _id: ctx.params.groupId || "global",
    users,
    numPages,
  };
});

/***** local methods *****/

const leaderboardQuery = async function({groupId, page}) {
  page = page || 0;

  let userQuery;
  if (groupId) {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new MalformedError(`Group with id ${groupId} does not exist.`);
    }
    userQuery = {_id: {$in: group.members}}; // only users in this group
  } else {
    userQuery = {}; // all users
  }

  const userCountP = User.count(userQuery).exec();
  const usersP = User.aggregate([
    {$match: userQuery},
    {$sort: {rating: -1, _id: 1}},
    {$skip: LEADERBOARD_PAGE_SIZE * page},
    {$limit: LEADERBOARD_PAGE_SIZE},
  ]).exec();

  const [users, userCount] = await Promise.all([usersP, userCountP]);

  return {users, userCount};
};

module.exports = leaderboardRouter;
