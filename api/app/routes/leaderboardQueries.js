const Group = require("../models").Group;
const User = require("../models").User;

const { MalformedError } = require("../errors");

const LEADERBOARD_PAGE_SIZE = 20;
/***** local query constructors *****/

module.exports.leaderboardQuery = async function({groupId, page}) {
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

module.exports.rankingQuery = async function({groupId, userId, userObj}) {
  const getUserProm = userObj ? Promise.resolve(userObj) : User.findById(userId);
  const fetches = [getUserProm];
  if (groupId) {
    fetches.push(Group.findById(groupId));
  }

  const [user, group] = await Promise.all(fetches);
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

// const rankingQuery = async function({groupId, userId}) {
//   let user = await User.findById(userId).populate("groups");
//
//   const userQuery = {rating: {$gt: user.rating}};
//
//   const groupings = [
//     // {
//     //   $group: {
//     //     _id: true,
//     //     count: { $sum: 1 }
//     //   }
//     // }
//   ];
//   const projections = {
//     _id: 1
//   };
//
//   if (groupId === "all") {
//     // could project a property onto each user for each group
//     user.groups.map(group => {
//       projections[`in${group._id}`] = {$in: ["$_id", group.members]};
//       groupings.push(
//         {
//           $group: {
//             _id: `$in${group._id}`,
//             count: { $sum: 1 }
//           }
//         }
//       );
//     });
//
//     // loop over all the users groups creating groupings
//   }
//   // if (mongoose.Types.ObjectId.isValid(groupId)) {
//   //   const group = await Group.findById(ctx.params.groupId);
//   //   userQuery._id = {$in: group.members};
//   // }
//
//   const pipeline = [
//     {$match: userQuery},
//     {$project: projections}
//   ].concat(groupings);
//
//   const counts = await User.aggregate(pipeline);
//   const rankings = counts;
//   // const rankings = {};
//   // user.groups.map((g, idx) => {
//   //   console.log(counts[idx]);
//   //   const numUsersAhead = counts[idx] ? counts[idx].filter(c => c._id)[0] : null;
//   //   const count = numUsersAhead ? numUsersAhead.count : NaN;
//   //   rankings[g._id] = count + 1; // the number of users ahead of us plus 1 is our rank
//   // });
//   return rankings;
// };
