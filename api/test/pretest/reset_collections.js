const models = require("../../app/models");
const Promise = require("bluebird");

module.exports = function() {
  /***** DROP ALL COLLECTIONS ******/
  return Promise.map(Object.keys(models), model => {
    return new Promise((resolve, reject) => {
      models[model].remove({}, function(err) {
        if (err) reject(err);
        resolve();
      });
    });
  });
};
