"use strict";
const expect = require("chai").expect;
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const resetCollections = require("../pretest/reset_collections");
const trueskill = require("../../app/lib/trueskill");

const models = require("../../app/models");

suite("TrueSkill Update Unit Test", function() {
  setup(async function() {
    await resetCollections();
  });

  test("User are created default true skill", async function() {
    const hash = await bcrypt.hash("password", 10);
    const user = await models.User.create({
      // create the user in the db
      username: "test_u",
      password: hash,
      trueSkill: {},
    });
    expect(user.trueSkill).to.exist();
    expect(user.trueSkill.mu).to.equal(trueskill.DEFAULT_MU);
    expect(user.trueSkill.sigma).to.equal(trueskill.DEFAULT_SIGMA);
  });

  test("Returns new mu and sigma for each player in a game result", async function() {
    const hash = await bcrypt.hash("password", 10);
    const user1Promise = models.User.create({
      // create the user in the db
      username: "test_u1",
      password: hash,
      trueSkill: {},
    });
    const user2Promise = models.User.create({
      // create the user in the db
      username: "test_u2",
      password: hash,
      trueSkill: {},
    });

    const users = [await user1Promise, await user2Promise];

    const newScores = trueskill.returnNewSkillOfPlayers(users);

    // ensure all ids of users are in the new scores object
    const hasAllUserIds = _.isEqual(Object.keys(newScores), users.map(u => u._id.toString()));
    expect(hasAllUserIds).to.be.true();

    // since all users had same mu/sig going in, the first player in array should now have highest mu, second player 2nd highest, etc
    let prevMu = Number.POSITIVE_INFINITY;
    users.forEach(u => {
      const userScore = newScores[u._id.toString()];
      expect(userScore < prevMu);
      prevMu = userScore;
    });

  });
});
