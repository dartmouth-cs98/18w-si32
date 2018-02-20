const Router = require("koa-router");

const auth = require("../auth");
const Group = require("../models").Group;

const groupRouter = Router();

/**
 * @api GET path /groups
 * Get groups with name similar to query (name contains query as subtring).
 */
groupRouter.get("/", auth.loggedIn, async (ctx) => {
  let groups;

  if (ctx.query.q) {
    groups = await Group.find({ "name": { "$regex": `${ctx.query.q}`, "$options": "i" } });
  } else {
    // return all groups
    groups = await Group.find();
  }
  ctx.body = groups;
});

/**
 * @api GET path /groups/leaderboard/:groupId
 * Get leaderboard for a specific group
 */
groupRouter.get("/leaderboard/:groupId", auth.loggedIn, async (ctx) => {
  // TODO: return users ranked by score. if :groupId is `global` or something, then query for all users
});

groupRouter.post("/", auth.loggedIn, async (ctx) => {
  console.log(ctx.request.body);
  console.log(ctx.state.userId);
  const {group, user} = await Group.createGroupWithFoundingMember(ctx.request.body.groupInfo, ctx.state.userId);

  ctx.body = { success: true, updatedRecords: [user, group] };
});

module.exports = groupRouter;
