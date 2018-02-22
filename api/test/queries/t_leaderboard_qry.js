"use strict";
const expect = require("chai").expect;
const bcrypt = require("bcryptjs");
const rewire = require("rewire");

const containsObjectId = require("../helpers/containsObjectId");
const resetCollections = require("../pretest/reset_collections");

const models = require("../../app/models");
const groupRoutes = rewire("../../app/routes/groupRoutes");
const leaderboardQuery = groupRoutes.__get__("leaderboardQuery");

suite.only("Test Leaderboard Query", function() {
  setup(async function() {
    await resetCollections();

    // create 10 users to sort
    for (let i = 0; i < 10; i++) {
      await models.User.create({
        // create the user in the db
        username: `test_u${i}`,
        password: await bcrypt.hash("password", 10),
        trueSkill: {}
      });
    }

  });

  test("Can get global leaderboard", async function() {
    const users = await leaderboardQuery({groupId: null});

    console.log(users);
  });

});
