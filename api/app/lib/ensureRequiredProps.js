const _ = require("lodash");

// returns array of strings in requiredProperties that are not a key on obj. empty array if obj has all
module.exports = (obj, requiredProperties) => {
  // lodash diff just returns all things in first array that are not in the following ones
  return _.difference(requiredProperties, Object.keys(obj));
};
