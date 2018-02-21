const Schema = require("mongoose").Schema;
const { DEFAULT_MU, DEFAULT_SIGMA } = require("../lib/trueskill");

const TrueSkillSchema = new Schema({
  mu: { type: Number, required: true, default: DEFAULT_MU },
  sigma: { type: Number, required: true, default: DEFAULT_SIGMA }
}, {
  _id: false,
});

module.exports = TrueSkillSchema;
