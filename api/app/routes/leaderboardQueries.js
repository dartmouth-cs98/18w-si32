const mongoose = require("mongoose");
const Group = require("../models").Group;
const User = require("../models").User;

const { MalformedError } = require("../errors");

const LEADERBOARD_PAGE_SIZE = 20;
/***** local query constructors *****/

module.exports.leaderboardQuery = async function({groupId, page}) {
  page = page || 0;

  let userQuery;
  if (mongoose.Types.ObjectId.isValid(groupId)) {
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

module.exports.rankingQuery = async function({groupId, userId, userObj}) {
  const getUserProm = userObj ? Promise.resolve(userObj) : User.findById(userId);
  const fetches = [getUserProm];

  if (mongoose.Types.ObjectId.isValid(groupId)) {
    fetches.push(Group.findById(groupId));
  }

  const [user, group] = await Promise.all(fetches);

  if (group && !user.groups.map(g => g.toString()).includes(group._id.toString())) {
    return null;
  }

  const userQuery = {rating: {$gt: user.rating}};
  if (group) {
    userQuery._id = {$in: group.members};
  }

  const count = await User.count(userQuery).exec();
  return count + 1;

};

module.exports.allRanksQuery = async function(userId) {
  const user = await User.findById(userId);

  const rankPromises = user.groups.map(groupId => {
    return module.exports.rankingQuery({groupId: groupId, userObj: user}).then(rank => {return {_id: groupId, rank};});
  });
  rankPromises.push(module.exports.rankingQuery({userObj: user}).then(rank => {return {_id: "global", rank};}));
  const ranks = await Promise.all(rankPromises);
  const rankObj = ranks.reduce((obj, rank) => {
    obj[rank._id] = rank.rank;
    return obj;
  }, {});

  return rankObj;
};
