const mongoose = require("mongoose");
const TrueSkill = require("../lib/trueskill");
const _ = require("lodash");
const { MalformedError } = require("../errors");

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
  skill: { mu: Schema.Types.Number, sigma: Schema.Types.Number }, // these numbers should always match the last entry in skillHistory
  skillHistory: [{
    mu: Schema.Types.Number,
    sigma: Schema.Types.Number,
    timestamp: Schema.Types.Date,
    match: { type: Schema.Types.ObjectId, ref: "Match" } // the match that resulted in this skill
  }],
  name: {
    type: String,
    required: true
  },
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

  const botsById = _.reduce(bots, (acc, bot) => { acc[bot._id] = bot; return acc }, {});

  // set up bots in format needed for trueskill
  const botsToSkill = _.map(rankedBotIds, botId =>  ({
    id: botId,
    skill: botsById[botId].skill,
  }));

  // compute the new skills
  const updatedSkills = TrueSkill.returnNewSkillOfPlayers(botsToSkill);

  // update the bots in the database
  _.each(bots, async b => {
    updatedSkills[b._id].prior = b.skill; // store prior skill on newSkills, for output

    // set the bot's new skill
    b.skill = {
      mu: updatedSkills[b._id].mu,
      sigma: updatedSkills[b._id].sigma,
    };

    // add an entry to the skill history list
    b.skillHistory.push(Object.assign({}, b.skill, {
      timestamp: new Date(),
      match: matchId,
    }));

    // save the bot
    await b.save();
  });

  // return the updated skills (which also contains the old ones)
  return updatedSkills;
};

const Bot = mongoose.model("Bot", _Bot);

module.exports = Bot;
