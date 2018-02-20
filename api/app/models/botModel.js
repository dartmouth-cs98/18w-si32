const mongoose = require("mongoose");
const _ = require("lodash");
const assert = require("assert");

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
  code: {
    url: { type: String, },
    key: { type: String, }
  }
}, {
  timestamps: true
});

_Bot.statics.findByUser = (userId) => {
  return Bot.find({
    user: userId,
  });
};

// Consumes an ordered array of how bots finished in a match.
// Updates those bots' skill stored in the db and returns the new skills, keyed on bot ID
_Bot.statics.updateSkillByRankedFinish = async (rankedBotIds, matchId) => {
  const bots = await Bot.find({ "_id": { "$in": rankedBotIds }});

  assert(bots.length == rankedBotIds.length);

  const botsById = _.reduce(bots, (acc, bot) => { acc[bot._id] = bot; return acc; }, {});

  // set up bots in format needed for trueskill
  const botsToSkill = _.map(rankedBotIds, botId =>  ({
    id: botId,
    skill: botsById[botId].trueSkill,
  }));

  // compute the new skills
  const updatedSkills = TrueSkill.returnNewSkillOfPlayers(botsToSkill);

  // update the bots in the database
  _.each(bots, async b => {
    // store prior skill on newSkills, so it's available for front-end
    updatedSkills[b._id].prior = b.trueSkill;

    // set the bot's new skill
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

  // return the updated skills (which also contains the old ones)
  return updatedSkills;
};

const Bot = mongoose.model("Bot", _Bot);

module.exports = Bot;
