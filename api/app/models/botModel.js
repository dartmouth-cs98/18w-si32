const mongoose = require("mongoose");
const _ = require("lodash");
const assert = require("assert");

const User = require("./userModel");
const TrueSkill = require("../lib/trueskill");
const TrueSkillSchema = require("./trueskill");

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
  versionHistory: [{
    _id: false,
    timestamp: Date,
    version: Number,
  }],
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
  params: [ {
    _id: false,
    name: String,
    value: Schema.Types.Mixed,
    type: { 
      type: String,
      enum: ["FLOAT", "INT", "STRING"],
    }
  } ],
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


const float_regex = /^[+-]?([0-9]*[.])?[0-9]+$/;
const int_regex = /^[+-]?[0-9]+$/;

// validates that all parameters in the array are set correctly
// cleans them to ensure everything in correct format
_Bot.statics.cleanParams = (params) => {
  if (!params) {
    return [];
  }
  const clean_params = [];

  _.each(params, p => {
    p.name = (p.name || "").trim();
    p.value = (p.value || "").trim();
    p.type = (p.type || "").trim();

    if (p.name == "" || p.value == "") {
      throw new MalformedError("Every param needs a name and value");
    }

    if (!_.includes(["int", "float", "string"], p.type)) {
      throw new MalformedError(`Invalid param type for ${p.name}`); 
    }

    // strip out all quotes from names/vals
    p.name = p.name.replace(/["']/g, "");
    p.value = p.value.replace(/["']/g, "");
    p.type = p.type.toUpperCase(); // type to uppercase

    if (p.type == "FLOAT" && !float_regex.test(p.value)) {
      throw new MalformedError(`${p.value} is not a valid float`);
    }

    if (p.type == "INT" && !int_regex.test(p.value)) {
      throw new MalformedError(`${p.value} is not a valid int`);
    }

    clean_params.push(p);
  });

  // at this point, everthing is valid, so we can just return the new params
  return clean_params;
};

// Consumes an ordered array of how bots finished in a match. Updates the skill
// for both the bots AND the users that own the bots. Returns the new bot skills,
// keyed on the bot ID
_Bot.statics.updateSkillByRankedFinish = async (rankedBots, matchId) => {
  const botIds = _.map(rankedBots, b => b._id);
  const bots = await Bot.find({ "_id": { "$in": botIds }});
  assert(bots.length == rankedBots.length);

  const botsById = _.reduce(bots, (acc, bot) => { acc[bot._id] = bot; return acc; }, {});

  // set up bots in format needed for trueskill
  const botsToSkill = _.map(rankedBots, bot =>  ({
    _id: bot._id,
    skill: botsById[bot._id].trueSkill,
    rank: bot.rank,
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
  const rankedUsers = _.uniqBy(rankedBots.map(bot => ({ _id: botsById[bot._id].user.toString(), rank: bot.rank })), "_id");

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
