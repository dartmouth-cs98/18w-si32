const RedisSessions = require("redis-sessions");

const RS_APPNAME = "si32";

const rs = new RedisSessions({
  host: "redis"
});

// returns promise
// resolves with session object
const create = (user, ip) => {
  return new Promise((resolve, reject) => {
    rs.create(
      {
        app: RS_APPNAME,
        id: user._id,
        ip,
        ttl: 10000
      },
      (err, resp) => {
        if (err) {
          reject(err);
        } else {
          resolve(resp);
        }
      }
    );
  });
};

// returns promise
// resolves with the user id associated with a valid token
const get = token => {
  return new Promise((resolve, reject) => {
    rs.get(
      {
        app: RS_APPNAME,
        token
      },
      (err, resp) => {
        if (err) {
          reject(err);
        } else {
          resolve(resp.id);
        }
      }
    );
  });
};

module.exports = {
  create,
  get
};
