const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DEFAULT_MU, DEFAULT_SIGMA } = require("../lib/trueskill");

const TrueSkillSchema = new Schema({
  mu: {type: Number, required: true},
  sigma: {type: Number, required: true}
},{ _id: false, timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

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
  trueSkillScore: {type: TrueSkillSchema, required: true, default: {mu: DEFAULT_MU, sigma: DEFAULT_SIGMA}},
  pastSkillScores: [{score: TrueSkillSchema, date: Date}]
}, {
  timestamps: true
});

_User.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", _User);

module.exports = User;
