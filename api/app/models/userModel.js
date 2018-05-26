const mongoose = require("mongoose");
const assert = require("assert");
const _ = require("lodash");
const Schema = mongoose.Schema;
const TrueSkillSchema = require("./trueskill");
const TrueSkill = require("../lib/trueskill");
const { MalformedError } = require("../errors");

const _User = new Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  onboard: {
    type: Boolean,
    default: false
  },
  trueSkill: { type: TrueSkillSchema, required: true },
  trueSkillHistory: [{
    score: TrueSkillSchema,
    match: { type: Schema.Types.ObjectId, ref: "Match" },
    timestamp: Date,
    _id: false
  }],
  rating: {
    type: Number,
    default: 0,
    required: true
  },
  following: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  groups: [{
    type: Schema.Types.ObjectId,
    ref: "Group"
  }]
}, {
  timestamps: true
});

_User.index({ rating: -1 });

_User.pre("save", function(next) {
  this.rating = this.trueSkill.mu - 3 * this.trueSkill.sigma;
  next();
});

_User.statics.updateSkillByRankedFinish = async function(rankedUsers, matchId) {
  const userIds = _.map(rankedUsers, u => u._id);
  const users = await User.find({ "_id": { "$in": userIds }});
  assert(users.length == rankedUsers.length);

  const usersById = _.reduce(users, (acc, user) => { acc[user._id] = user; return acc; }, {});

  // set up users in format needed for trueskill
  const usersToSkill = _.map(rankedUsers, u =>  ({
    _id: u._id,
    skill: usersById[u._id].trueSkill,
    rank: u.rank,
  }));

  // compute the new skills
  const updatedSkills = TrueSkill.returnNewSkillOfPlayers(usersToSkill);

  _.each(users, async u => {
    // set the bot's new skill
    u.trueSkill = {
      mu: updatedSkills[u._id].mu,
      sigma: updatedSkills[u._id].sigma,
    };

    // add an entry to the skill history list
    u.trueSkillHistory.push({
      score: u.trueSkill,
      timestamp: new Date(),
      match: matchId,
    });

    // save the user
    await u.save();
  });
};

_User.statics.onboard = async function(userId) {
  return await User.findOneAndUpdate({ _id: userId }, { "$set": { "onboard": true }}, { new: true });
};

// generic follow/unfollow helper. pass in which op to do and updates both target and source
_User.methods._followUnfollow = async function(targetUserId, op) {
  if (targetUserId == this._id.toString())  {
    throw new MalformedError("You can't follow yourself!");
  }

  // targetUser contains user correctly
  const userFrom = await User.findOneAndUpdate({ _id: targetUserId }, { [op]: { "followers": this._id }}, { new: true });

  if (!userFrom) {
    throw new MalformedError("Couldn't find that user");
  }

  // user contains targetUser correctly
  const userTo = await User.findOneAndUpdate({ _id: this._id }, { [op]: { "following": targetUserId }}, { new: true });

  return { userFrom, userTo };
};

// this instance of a user starts following targetUser
_User.methods.follow = async function(targetUserId) {
  return await this._followUnfollow(targetUserId, "$addToSet");
};

// this instance of a user stops following targetUser
_User.methods.unfollow = async function(targetUserId) {
  return await this._followUnfollow(targetUserId, "$pull");
};

_User.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", _User);

module.exports = User;
