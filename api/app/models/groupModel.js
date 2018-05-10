const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./userModel");
const ensureRequiredProps = require("../lib/ensureRequiredProps");

const { MalformedError } = require("../errors");

const _Group = new Schema({
  name: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  description: {
    type: String,
    default: "",
  },
  public: {
    type: Boolean,
    required: true,
    default: true,
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
}, {
  timestamps: true
});

// generic add/remove helper. pass in which op to do and updates both target and source
_Group.methods._addRemoveMember = async function(targetUserId, op) {
  // targetUser contains user correctly
  const user = await User.findOneAndUpdate({ _id: targetUserId }, { [op]: { "groups": this._id }}, { new: true }).populate("groups");

  if (!user) {
    throw new MalformedError("Couldn't find that user");
  }

  // user contains targetUser correctly
  const group = await Group.findOneAndUpdate({ _id: this._id }, { [op]: { "members": targetUserId }}, { new: true });

  return { user, group };
};

// this instance of a user starts following targetUser
_Group.methods.addMember = async function(targetUserId) {
  return await this._addRemoveMember(targetUserId, "$addToSet");
};

// this instance of a user stops following targetUser
_Group.methods.removeMember = async function(targetUserId) {
  return await this._addRemoveMember(targetUserId, "$pull");
};

_Group.statics.createGroupWithFoundingMember = async function(groupInfo, foundingUserId) {
  if (!groupInfo.name) {
    throw new MalformedError("'name' is required to create a group");
  }

  const existingGroup = await Group.find({
    name: groupInfo.name,
  });

  if (existingGroup) {
    throw new MalformedError("A group already exists with that name");
  }

  const group = await Group.create({
    name: groupInfo.name,
    description: groupInfo.description,
    public: groupInfo.public,
    members: [foundingUserId],
  });

  const user = await User.findOneAndUpdate({ _id: foundingUserId }, { $addToSet: { "groups": group._id }}, { new: true }).populate("groups");

  return { user, group };
};


_Group.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

const Group = mongoose.model("Group", _Group);

module.exports = Group;
