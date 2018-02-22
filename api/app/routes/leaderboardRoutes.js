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
  const users = await leaderboardQuery({groupId: ctx.params.groupId});

  ctx.body = {
    _id: ctx.params.groupId || "global",
    users,
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

  const users = await User.aggregate([
    {$match: userQuery},
    { $addFields: {
      rank: {
        $subtract: [
          "$trueSkill.mu",
          {
            $multiply: [
              3, "$trueSkill.sigma"
            ]
          }
        ]
      }
    }},
    {$sort: {rank: -1}},
    {$skip: LEADERBOARD_PAGE_SIZE * page},
    {$limit: LEADERBOARD_PAGE_SIZE},
  ]).exec();

  return users;
};

module.exports = leaderboardRouter;
