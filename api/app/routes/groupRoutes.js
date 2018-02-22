const Router = require("koa-router");

const auth = require("../auth");
const Group = require("../models").Group;

const { MalformedError } = require("../errors");

const groupRouter = Router();

/**
 * @api GET path /groups
 * Get groups with name similar to query (name contains query as subtring).
 */
groupRouter.get("/:id", auth.loggedIn, async (ctx) => {
  const group = await Group.findById(ctx.params.id);
  if (!group) {
    throw new MalformedError(`Group with id ${ctx.params.id} does not exist.`);
  }
  ctx.body = group;
});

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
 * @api POST path /groups/
 * Create group
 */
groupRouter.post("/", auth.loggedIn, async (ctx) => {
  const {group, user} = await Group.createGroupWithFoundingMember(ctx.request.body.groupInfo, ctx.state.userId);

  ctx.body = { success: true, updatedRecords: [user, group] };
});


module.exports = groupRouter;
