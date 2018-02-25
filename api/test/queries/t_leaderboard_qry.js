"use strict";
const expect = require("chai").expect;
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const resetCollections = require("../pretest/reset_collections");

const models = require("../../app/models");
const {leaderboardQuery, rankingQuery, allRanksQuery} = require("../../app/routes/leaderboardQueries");

const NUM_USERS = 10;

suite("Test Leaderboard Query", function() {
  let users;
  setup(async function() {
    this.timeout(3000);
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

    expect(leaderboardUsers.users).to.be.of.length(NUM_USERS);

    expect(leaderboardUsers.userCount).to.equal(NUM_USERS);

    let prevRank = Number.POSITIVE_INFINITY;
    leaderboardUsers.users.forEach(user => {
      expect(user.rating <= prevRank).to.be.true();
      prevRank = user.rating;
    });
  });

  test("Can get group leaderboard and it contains only group members, sorted", async function() {
    const groupName = "Robin & Co";
    const group = await models.Group.create({
      // create the user in the db
      name: groupName,
      public: true,
    });

    const members = users.slice(0, Math.floor(NUM_USERS / 2));

    const addPromises = members.map(user => group.addMember(user._id));
    await Promise.all(addPromises);

    const leaderboardUsers = await leaderboardQuery({groupId: group.id});

    expect(leaderboardUsers.users).to.be.of.length(members.length);
    expect(leaderboardUsers.userCount).to.equal(members.length);

    let prevRank = Number.POSITIVE_INFINITY;
    leaderboardUsers.users.forEach(user => {
      expect(user.rating <= prevRank).to.be.true();
      prevRank = user.rating;
    });
  });

  test("Can get rank of a user within a specific group", async function() {
    const groupName = "Robin & Co";
    const group = await models.Group.create({
      // create the user in the db
      name: groupName,
      public: true,
    });

    const members = users.slice(0, Math.floor(NUM_USERS / 2));
    const user = _.minBy(members, function(u) { return u.rating; });


    const addPromises = members.map(user => group.addMember(user._id));
    await Promise.all(addPromises);

    const result = await rankingQuery({groupId: group._id, userId: user._id});

    // should be last since we chose user with min rating
    expect(result).to.equal(Math.floor(NUM_USERS / 2));

  });

  test("Can get rank of a user globally", async function() {

    const user = _.minBy(users, function(u) { return u.rating; });

    const result = await rankingQuery({userId: user._id});

    // should be last since we chose user with min rating
    expect(result).to.equal(users.length);
  });

  test("Can get all ranks of a user", async function() {
    const groupName = "Robin & Co";
    const group = await models.Group.create({
      // create the user in the db
      name: groupName,
      public: true,
    });

    const members = users.slice(0, Math.floor(NUM_USERS / 2));
    const user = _.minBy(members, function(u) { return u.rating; });

    const addPromises = members.map(user => group.addMember(user._id));
    await Promise.all(addPromises);

    const result = await allRanksQuery(user._id);

    const global = result.global;
    expect(global).to.equal(users.length);

    const groupRank = result[group._id.toString()];
    // should be last since we chose user with min rating
    expect(groupRank).to.equal(Math.floor(NUM_USERS / 2));

  });
});
