const trueskill = require("trueskill");

const DEFAULT_MU = 25.0;
const DEFAULT_SIGMA = 25.0 / 3;
const BOT_SIGMA_ADJUST = 1.7;
const USER_SIGMA_ADJUST = 1.2;

/**
  * returnNewSkillOfPlayers
  * Input:
  *   playersInRankedOrder is an array of users in order of their finish.
  *   i.e playersInRankedOrder[0] is the user object of player who finished first in this game
  * Output:
  *   returns a map of player ids to their new mu and sigma
  * IMPT: This method does not mutate the player objects themselves, it only returns what their new score should be
*/
module.exports.returnNewSkillOfPlayers = (players) => {
  const playerSkills = players.map((playerObj) => {
    const skillScore = playerObj.skill || {mu: DEFAULT_MU, sigma: DEFAULT_SIGMA};
    return {
      _id: playerObj._id.toString(),
      skill: [skillScore.mu || DEFAULT_MU, skillScore.sigma || DEFAULT_SIGMA],
      rank: playerObj.rank,
    };
  });

  trueskill.AdjustPlayers(playerSkills);

  const playerIdsToNewMuSig = playerSkills.reduce((obj, player) => {
    obj[player._id.toString()] = { mu: player.skill[0], sigma: player.skill[1] };
    return obj;
  }, {});

  return playerIdsToNewMuSig;
};

module.exports.DEFAULT_MU = DEFAULT_MU;
module.exports.DEFAULT_SIGMA = DEFAULT_SIGMA;
module.exports.BOT_SIGMA_ADJUST = BOT_SIGMA_ADJUST;
module.exports.USER_SIGMA_ADJUST = USER_SIGMA_ADJUST;
