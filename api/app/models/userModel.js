const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TrueSkillSchema = require("./trueskill");

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
  trueSkill: { type: TrueSkillSchema },
  trueSkillHistory: [{ score: TrueSkillSchema, timestamp: Date }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
}, {
  timestamps: true
});

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
