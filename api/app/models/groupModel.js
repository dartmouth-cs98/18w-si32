const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./userModel");

const { MalformedError } = require("../errors");

const _Group = new Schema({
  name: {
    type: String,
    required: true,
    index: {
      unique: true
    }
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
  const user = await User.findOneAndUpdate({ _id: targetUserId }, { [op]: { "groups": this._id }}, { new: true });

  if (!user) {
    throw new MalformedError("Couldn't find that user");
  }

  // user contains targetUser correctly
  console.log(this._id);
  const group = await Group.findOneAndUpdate({ _id: this._id }, { [op]: { "members": targetUserId }}, { new: true });
  console.log(group);

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


_Group.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

const Group = mongoose.model("Group", _Group);

module.exports = Group;
