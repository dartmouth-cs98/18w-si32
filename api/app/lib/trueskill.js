const trueskill = require("trueskill");

const DEFAULT_MU = 25.0;
const DEFAULT_SIGMA = 25.0 / 3;

/**
  * returnNewSkillOfPlayers
  * Input:
  *   playersInRankedOrder is an array of users in order of their finish.
  *   i.e playersInRankedOrder[0] is the user object of player who finished first in this game
  * Output:
  *   returns a map of player ids to their new mu and sigma
  * IMPT: This method does not mutate the player objects themselves, it only returns what their new score should be
*/
module.exports.returnNewSkillOfPlayers = (playersInRankedOrder) => {
  const playerSkills = playersInRankedOrder.map((playerObj, idx) => {
    const skillScore = playerObj.trueSkillScore || {mu: DEFAULT_MU, sigma: DEFAULT_SIGMA};
    return {
      id: playerObj.id.toString(),
      skill: [skillScore.mu, skillScore.sigma],
      rank: idx,    // players index in playersInRankedOrder gives their relative rank in this game
    };
  });

  trueskill.AdjustPlayers(playerSkills);

  const playerIdsToNewMuSig = playerSkills.reduce((obj, player) => {
    obj[player.id.toString()] = player.skill;
    return obj;
  }, {});

  return playerIdsToNewMuSig;
};

module.exports.DEFAULT_MU = DEFAULT_MU;
module.exports.DEFAULT_SIGMA = DEFAULT_SIGMA;
