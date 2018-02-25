const mongoose = require("mongoose");
const _ = require("lodash");
const assert = require("assert");

const User = require("./userModel");
const TrueSkill = require("../lib/trueskill");
const TrueSkillSchema = require("./trueskill");

const Schema = mongoose.Schema;

const _Bot = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  version: {
    type: Number,
    default: 1,
  },
  name: {
    type: String,
    required: true
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
  code: { type: String, },
}, {
  timestamps: true
});

_Bot.pre("save", function(next) {
  this.rating = this.trueSkill.mu - 3 * this.trueSkill.sigma;
  next();
});

_Bot.statics.findByUser = (userId) => {
  return Bot.find({
    user: userId,
  });
};

// Consumes an ordered array of how bots finished in a match. Updates the skill
// for both the bots AND the users that own the bots. Returns the new bot skills,
// keyed on the bot ID
_Bot.statics.updateSkillByRankedFinish = async (rankedBotIds, matchId) => {
  const bots = await Bot.find({ "_id": { "$in": rankedBotIds }});
  assert(bots.length == rankedBotIds.length);

  const botsById = _.reduce(bots, (acc, bot) => { acc[bot._id] = bot; return acc; }, {});

  // set up bots in format needed for trueskill
  const botsToSkill = _.map(rankedBotIds, botId =>  ({
    _id: botId,
    skill: botsById[botId].trueSkill,
  }));

  // compute the new skills
  const updatedSkills = TrueSkill.returnNewSkillOfPlayers(botsToSkill);

  // update the bots in the database
  _.each(bots, async b => {
    // store prior skill on newSkills, so it's available for front-end
    updatedSkills[b._id].prior = b.trueSkill;

    // set the bot's new skill5a8b76c9aedc7a0915cf6a72
    b.trueSkill = {
      mu: updatedSkills[b._id].mu,
      sigma: updatedSkills[b._id].sigma,
    };

    // add an entry to the skill history list
    b.trueSkillHistory.push({
      score: b.trueSkill,
      timestamp: new Date(),
      match: matchId,
    });

    // save the bot
    await b.save();
  });

  // update the skill of the users that own the bots
  const rankedUsers = _.uniq(rankedBotIds.map(botId => botsById[botId].user.toString()));

  // if any user had more than 1 bot in the match, don't do anything to the user scores
  // A user score should only be updated in an even match
  if (bots.length == rankedUsers.length) {
    User.updateSkillByRankedFinish(rankedUsers);
  }

  // return the updated skills (which also contains the old ones)
  return updatedSkills;
};

const Bot = mongoose.model("Bot", _Bot);

module.exports = Bot;
