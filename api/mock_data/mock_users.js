const bcrypt = require("bcryptjs");

require("../app/db");
const User = require("../app/models").User;

const NUM_USERS = 50;

const createUsers = async function() {
  const userCreations = [];

  // create 10 users to sort. sorry for using a for loop
  for (let i = 0; i < NUM_USERS; i++) {
    const sigma = Math.floor(Math.random() * 6) + 1;
    const password = await bcrypt.hash("password", 10);
    userCreations.push(
      User.create({
        // create the user in the db
        username: `test_u${getRandomInt(100000)}`,
        password,
        trueSkill: {mu: 25 + i, sigma}
      })
    );
  }

  return await Promise.all(userCreations);
};

createUsers().then(() => {
  /* eslint-disable */
  console.log("done");
  process.exit();
  /* eslint-enable */
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
