const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const _ = require("lodash");
const Bot = require("./botModel");
const s3 = require("../files/s3");
const { MalformedError } = require("../errors");
const assert = require("assert");

const _Match = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // all users involved in this match
  users: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  // all bots involved. A user may have multiple bots in one game so bots:users is not 1:1
  bots: [{ type: Schema.Types.Mixed }],
  status: {
    type: String,
    enum: ["QUEUED", "RUNNING", "DONE"],
    default: "QUEUED",
  },
  result: Object, // some stats on the game we can have without reading the log
  logKey: String, // complete game log stored on S3
}, {
  timestamps: true
});

_Match.statics.createWithBots = (userId, botIds) => {
  assert(2 <= botIds.length && botIds.length <= 4 && _.every(botIds, _.isString), "Need 2-4 bots to start a match!");
  return Bot.find({
    "_id": { $in: botIds }
  }).select({ code: 1, _id: 1, name: 1, user: 1, version: 1 }).lean().then(bots => {
    if (bots.length != botIds.length) {
      throw new MalformedError("not all bots found");
    }

    // pluck all users involved in the match
    const allUserIds = _.uniq(bots.map(b => b.user.toString()));

    return Match.create({
      createdBy: userId,
      users: allUserIds,
      bots: bots,
    });
  });
};

// finds, updates, and returns the next match to be played
_Match.statics.getNext = () => {
  return Match.findOneAndUpdate({
    status: "QUEUED"
  }, {
    status: "RUNNING",
  })
  .sort({ createdAt: -1 })
  .then(match => {
    if (!match) {
      return null;
    }

    // get pre-signed AWS link for each bot
    const bots = match.bots.map((bot,i) => (
      {
        name: bot.name,
        id: bot._id,
        index: i,
        url: s3.getBotUrl(bot.code),
      }
    ));

    // return only what the worker needs
    return {
      bots,
      id: match._id,
      gameType: "SimpleGame", // everything is a SimpleGame at this point
    };
  });
};

_Match.statics.handleWorkerResponse = async (id, rankedBots, logKey, result={}) => {
  // pull the things we need from gameOutput
  const match = await Match.findById(id);

  assert(match);
  assert(match.status != "DONE", `match ${id} is already finished`);
  assert(rankedBots.length == match.bots.length, "Didn't get the correct number of ranked bots");

  // update the bot AND user skills. Because bots are own by users, this function will always
  // update both as needed.
  const botSkills = await Bot.updateSkillByRankedFinish(_.map(rankedBots, b => b._id), match._id);

  // turn array of bots into obj keyed on bot ID storing ranked finish
  const botRankById = {};
  _.each(rankedBots, (b, i) => {
    botRankById[b._id] = b;
  });

  console.log("bots", rankedBots);

  // store the individual bots' skills and rank in this match
  const newBots = _.map(match.bots, b => {
    const skill = botSkills[b._id];
    b.trueSkill = {
      mu: skill.prior.mu,
      sigma: skill.prior.sigma,
      delta: skill.mu - skill.prior.mu // how much this match changed the bot's skill
    };
    Object.assign(b, botRankById[b._id]);
    return b;
  });

  // update and save the match back into the db
  match.result = result;
  match.bots = newBots;
  match.status = "DONE";
  match.success = true;
  match.logKey = logKey;
  match.markModified("bots"); // need to alert mongoose that the array is different

  return match.save();

  // TODO if result was our fault, set status back to queued and try again?
};

const Match = mongoose.model("Match", _Match);

module.exports = Match;
