const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const _ = require("lodash");
const Bot = require("./botModel");
const s3 = require("../files/s3");

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
  log: Object, // complete game log stored on S3
}, {
  timestamps: true
});

_Match.statics.createWithBots = (userId, botIds) => {
  return Bot.find({
    "_id": { $in: botIds }
  }).lean().then(bots => {
    if (bots.length != botIds.length) {
      throw new Error("not all bots found");
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
        url: s3.getBotUrl(bot.code.key),
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

_Match.statics.handleWorkerResponse = (id, result, log) => {
  // TODO if result was our fault, set status back to queued and try again?

  // TODO parse the game result, and if it was a completed game then compute new mu and sigma from players using
  // lib/trueskill

  return Match.update({ "_id": id }, {
    "$set": {
      result,
      log,
      status: "DONE",
    }
  });
};

const Match = mongoose.model("Match", _Match);

module.exports = Match;
