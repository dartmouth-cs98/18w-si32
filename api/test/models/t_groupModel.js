"use strict";
const expect = require("chai").expect;
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const containsObjectId = require("../helpers/containsObjectId");
const resetCollections = require("../pretest/reset_collections");
const trueskill = require("../../app/lib/trueskill");

const models = require("../../app/models");

suite("Test Group Model", function() {
  setup(async function() {
    await resetCollections();
  });

  test("Can Create One Manually", async function() {
    const groupName = "Robin & Co";
    const group = await models.Group.create({
      // create the user in the db
      name: groupName,
      public: true
    });

    expect(group).to.exist();
    expect(group.name).to.equal(groupName);
  });

  test("createGroupWithFoundingMember", async function() {
    const founder = await models.User.create({
      // create the user in the db
      username: "test_u",
      password: await bcrypt.hash("password", 10),
    });

    const groupInfo = {
      name: "Robin & Co",
      description: "Spoiler alert: its just Robin and no one else",
      public: true,
    };

    const {group, user} = await models.Group.createGroupWithFoundingMember(groupInfo, founder._id);

    // user has new group in groups
    expect(containsObjectId(user.groups, group._id)).to.be.true();

    // group created correctly
    expect(group.name).to.equal(groupInfo.name);
    expect(group.description).to.equal(groupInfo.description);
    expect(group.public).to.equal(groupInfo.public);
    expect(containsObjectId(group.members, user._id));
  });


  test("Adding user to public group", async function() {
    const groupName = "Robin & Co";
    const group = await models.Group.create({
      // create the user in the db
      name: groupName,
      public: true
    });

    const user = await models.User.create({
      // create the user in the db
      username: "test_u",
      password: await bcrypt.hash("password", 10)
    });


    expect(group.members).to.be.of.length(0);
    expect(user.groups).to.be.of.length(0);

    const updated = await group.addMember(user._id);

    expect(updated.group).to.exist();
    expect(updated.user).to.exist();

    const groupMembers = updated.group.members.map(member => member.toString());
    expect(groupMembers).to.contain(user._id.toString());

    const userGroups = updated.user.groups.map(group => group.toString());
    expect(userGroups).to.contain(group._id.toString());
  });

  test("Removing user to public group", async function() {
    const groupName = "Robin & Co";
    const group = await models.Group.create({
      // create the user in the db
      name: groupName,
      public: true
    });

    const user = await models.User.create({
      // create the user in the db
      username: "test_u",
      password: await bcrypt.hash("password", 10)
    });

    const afterAdd = await group.addMember(user._id);

    const numMembersBefore = afterAdd.group.members.length;
    const numGroupsBefore = afterAdd.user.groups.length;

    const afterRemove = await group.removeMember(user._id);

    const numMembersNow = afterRemove.group.members.length;
    const numGroupsNow = afterRemove.user.groups.length;

    expect(numMembersNow).to.equal(numMembersBefore - 1);
    expect(numGroupsNow).to.equal(numGroupsBefore - 1);
  });
});
