const RedisSessions = require("redis-sessions");

const RS_APPNAME = "si32";

const rs = new RedisSessions({
  host: "redis"
});

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

// resolves with the user id associated with a valid token
const get = token => {
  return new Promise((resolve, reject) => {
    rs.get(
      {
        app: RS_APPNAME,
        token
      },
      (err, session) => {
        console.log("SESSION GET", err, session);
        if (err || !session.id) {
          reject(err);
        } else {
          resolve(session.id);
        }
      }
    );
  });
};

// removes session by token
const destroy = token => {
  return new Promise((resolve, reject) => {
    rs.kill(
      {
        app: RS_APPNAME,
        token
      },
      (err, resp) => {
        if (err || resp.kill == 0) {
          reject();
        } else {
          resolve();
        }
      }
    );
  });
};

module.exports = {
  create,
  get,
  destroy
};
