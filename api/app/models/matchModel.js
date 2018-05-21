const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const _ = require("lodash");
const Bot = require("./botModel");
const User = require("./userModel");
const s3 = require("../files/s3");
const { MalformedError } = require("../errors");
const assert = require("assert");

const _Match = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  // all users involved in this match
  users: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  isChallenge: {
    type: Schema.Types.Boolean,
    default: false,
  },
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

_Match.statics.createWithBots = (userId, botIds, { isChallenge=false, status="QUEUED" }) => {
  assert(2 <= botIds.length && botIds.length <= 4 && _.every(botIds, _.isString), "Need 2-4 bots to start a match!");
  return Bot.find({
    "_id": { $in: botIds }
  }).select({ code: 1, _id: 1, name: 1, user: 1, params: 1, version: 1 }).lean().then(bots => {
    if (bots.length != botIds.length) {
      throw new MalformedError("not all bots found");
    }

    // pluck all users involved in the match
    const allUserIds = _.uniq(bots.map(b => b.user.toString()));

    // we copy the bot data into the match so that we have a full record of who
    // the bots were when they played
    return Match.create({
      createdBy: userId,
      users: allUserIds,
      bots: bots,
      isChallenge,
      status,
    });
  });
};

// how many bots to select the closest skill out of
const BOT_SELECT_RANGE = 10;

// selects a random bot to play in a match, with rating 
// ideally somewhat close to skillMu
// and no user in common with users in chosenBOts
const getNextBotToPlay = async (targetMu, chosenBots) => {
  const nBotsTotal = await Bot.count({});
  // pick a random number out of all the bots, skewed left
  const beta = Math.pow(Math.sin(Math.random()*Math.PI/2), 2); // transform uniform distribution to beta distribution
  const botIdx = parseInt( ((beta < 0.5) ? 2*beta : 2*(1-beta)) * nBotsTotal ); // index of first player to choose

  const bots = await Bot.aggregate([
    {$match: {}},
    {$project: {id: 1, user: 1, params: 1, lastSkill: {$slice: ["$trueSkillHistory", -1]}}},
    {$sort: {"lastSkill.timestamp": 1}}, // sort by most recently updated date w/ oldest first
    {$sort: {lastDate: 1}}, // sort by most recently updated date w/ oldest first
    {$skip: botIdx}, // offset by our randomly distributed value
    {$limit: BOT_SELECT_RANGE},
  ]).exec();

  let bestBot = { lastSkill: { mu: 1000000 }};

  _.each(bots, b => {
    if (Math.abs(b.lastSkill.mu - targetMu) > Math.abs(bestBot.lastSkill.mu - targetMu)) {
      return;
    }

    if (_.some(chosenBots, chosenB => chosenB.user.toString() == b.user.toString())) {
      return;
    }

    // by the time we're here, the bot is the new best!
    bestBot = b;
  });

  return bestBot;
};

// creates and returns a non-challenge match 
const getNextStandardMatch = async () => {
  const nPlayersTotal = await User.count({});

  let firstBot = null;
  while (firstBot == null) {
    // random number math from 
    // https://stackoverflow.com/questions/16110758/generate-random-number-with-a-non-uniform-distribution
    const beta = Math.pow(Math.sin(Math.random()*Math.PI/2), 2); // transform uniform distribution to beta distribution
    const firstPlayerIdx = parseInt(((beta < 0.5) ? 2*beta : 2*(1-beta)) * nPlayersTotal); 

    // from all users, select the one that is offset by firstPlayerIdx into
    // those who haven't had their trueskill updated recently
    const firstPlayer = await User.aggregate([
      {$match: {}},
      {$project: {_id: 1, lastSkill: {$slice: ["$trueSkillHistory", -1]}}},
      {$sort: {"lastSkill.timestamp": 1}}, // sort by most recently updated date w/ oldest first
      {$skip: firstPlayerIdx},// offset by our randomly distributed value
      {$limit: 1},
    ]).exec();

    // select the bots of the chosen user
    const playerBots = await Bot.find(
      { user: firstPlayer[0]._id },
      { _id: 1, user: 1, params: 1, trueSkillHistory: 1 }
    );

    // if the player has bots, select one at random
    if (playerBots && playerBots.length > 0) {
      firstBot = playerBots[Math.floor(Math.random() * playerBots.length)];
    }
  }

  const targetSkill = firstBot.trueSkillHistory[firstBot.trueSkillHistory.length - 1].mu;
  const matchSize = Math.floor(Math.random() * 3 + 2); // random number of players 2-4
  const bots = [firstBot];

  // loop to fill out the match players; but only make matchSize*2 attempts
  let nTries = 0;
  while (bots.length < matchSize && (nTries < matchSize * 2 || bots.length < 2)) {
    const nextBot = await getNextBotToPlay(targetSkill, bots);
    if (nextBot._id) {
      bots.push(nextBot);
    }
    nTries++; // don't want to spin forever, just start a smaller match
  }

  // finally, create a match with all the bots we found
  const botIds = _.map(bots, b => b._id.toString());
  return Match.createWithBots(null, botIds, { isChallenge: false, status: "RUNNING" });
};

// get the next challenge match that's been queued
const getNextChallengeMatch = async () => {
  return Match.findOneAndUpdate({
      status: "QUEUED"
    }, {
      status: "RUNNING",
    })
    .sort({ createdAt: -1 });
};

// finds, updates, and returns the next match to be played
_Match.statics.getNext = async () => {
  // if true, we won't create any 'normal' ranked games and only return
  // games that are challenges
  const queueOnly = process.env.QUEUE_ONLY == "true";

  // the match to return to the worker
  let match;

  const useQueue = Math.random() < .7 || queueOnly;
  if (useQueue) { // if we're using the queue, get the next one
    match = await getNextChallengeMatch();
  }

  // create one, if no queued match and we're not using only the queue
  if (!queueOnly && !match) {
    match = await getNextStandardMatch();
  }

  if (!match) {
    return null;
  }

  // get pre-signed AWS link for each bot
  const bots = match.bots.map((bot,i) => (
    {
      name: bot.name,
      id: bot._id,
      params: bot.params,
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
};

_Match.statics.handleWorkerResponse = async (id, rankedBots, logKey, result={}) => {
  // pull the things we need from gameOutput
  const match = await Match.findById(id);

  assert(match);
  assert(match.status != "DONE", `match ${id} is already finished`);
  assert(rankedBots.length == match.bots.length, "Didn't get the correct number of ranked bots");

  // turn array of bots into obj keyed on bot ID storing ranked finish
  const botRankById = {};
  _.each(rankedBots, b  => {
    botRankById[b._id] = b;
  });

  // will store the updated bots for the match  
  let newBots; 
  
  // when not a challenge match, update the rankings and store the changes
  if (!match.isChallenge) {
    // update the bot AND user skills. Because bots are own by users, this function will always
    // update both as needed.
    const botSkills = await Bot.updateSkillByRankedFinish(rankedBots, match._id);

    // store the individual bots' skills and rank in this match
    newBots = _.map(match.bots, b => {
      const skill = botSkills[b._id];
      b.trueSkill = {
        mu: skill.prior.mu,
        sigma: skill.prior.sigma,
        delta: skill.mu - skill.prior.mu // how much this match changed the bot's skill
      };
      Object.assign(b, botRankById[b._id]);
      return b;
    });
  } else {
    // otherwise, for games that are challenges, just record the bots' skills 
    const botIds = _.map(rankedBots, b => b._id);
    const bots = await Bot.find({ "_id": { "$in": botIds }});
    assert(bots.length == rankedBots.length);

    newBots = _.map(match.bots, b => {
      const fullBot = _.find(bots, { "_id": b._id });
      Object.assign(b, botRankById[b._id]);
      b.trueSkill = fullBot.trueSkill;
      return b;
    });
  }

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
