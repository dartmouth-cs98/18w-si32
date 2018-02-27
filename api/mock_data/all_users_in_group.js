const bcrypt = require("bcryptjs");

require("../app/db");
const User = require("../app/models").User;
const Group = require("../app/models").Group;
const Promise = require("bluebird");

Group.findOne({})
.then(group => {
  return Promise.join(
    User.find({})
    .lean()
    .distinct("_id")
    .then(users => {
      return Group.update({_id: group}, {members: users}).exec();
    }),
    User.update({}, {groups: [group._id]}, {multi: true}).exec()
  );
});
