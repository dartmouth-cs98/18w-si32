"use strict";
const expect = require("chai").expect;
const bcrypt = require("bcryptjs");
const rewire = require("rewire");

const resetCollections = require("../pretest/reset_collections");

const models = require("../../app/models");
const leaderboardRoutes = rewire("../../app/routes/leaderboardRoutes");
const leaderboardQuery = leaderboardRoutes.__get__("leaderboardQuery");

const NUM_USERS = 10;

suite("Test Leaderboard Query", function() {
  let users;
  setup(async function() {
    await resetCollections();

    const userCreations = [];

    // create 10 users to sort. sorry for using a for loop
    for (let i = 0; i < NUM_USERS; i++) {
      userCreations.push(
        models.User.create({
          // create the user in the db
          username: `test_u${i}`,
          password: await bcrypt.hash("password", 10),
          trueSkill: {mu: 25 + i, sigma: 8.33}
        })
      );
    }

    users = await Promise.all(userCreations);
  });

  test("Can get global leaderboard and it is sorted", async function() {
    const leaderboardUsers = await leaderboardQuery({groupId: null});

    expect(leaderboardUsers).to.be.of.length(NUM_USERS);

    let prevRank = Number.POSITIVE_INFINITY;
    leaderboardUsers.forEach(user => {
      expect(user.rank <= prevRank).to.be.true();
      prevRank = user.rank;
    });
  });

  test("Can get group leaderboard and it contains only group members, sorted", async function() {
    const groupName = "Robin & Co";
    const group = await models.Group.create({
      // create the user in the db
      name: groupName,
      public: true,
    });

    const members = users.splice(0, Math.floor(NUM_USERS / 2));

    const addPromises = members.map(user => group.addMember(user._id));
    await Promise.all(addPromises);

    const leaderboardUsers = await leaderboardQuery({groupId: group.id});

    expect(leaderboardUsers).to.be.of.length(members.length);

    let prevRank = Number.POSITIVE_INFINITY;
    leaderboardUsers.forEach(user => {
      expect(user.rank <= prevRank).to.be.true();
      prevRank = user.rank;
    });
  });

});
