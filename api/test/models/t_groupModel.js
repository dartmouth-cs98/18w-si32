"use strict";
const expect = require("chai").expect;
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const resetCollections = require("../pretest/reset_collections");
const trueskill = require("../../app/lib/trueskill");

const models = require("../../app/models");

suite("Test Group Model", function() {
  setup(async function() {
    await resetCollections();
  });

  test("Can Create One", async function() {
    const groupName = "Robin & Co";
    const group = await models.Group.create({
      // create the user in the db
      name: groupName,
      public: true
    });

    expect(group).to.exist();
    expect(group.name).to.equal(groupName);
  });


  test("Adding user to public group", async function() {

  });
});
