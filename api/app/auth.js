const session = require('./session');

// middleware that passes if user is logged in
const loggedIn = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({"message": "Auth required"});
  }

  const token = req.headers.authorization.replace('Bearer ', '');
  session.get(token).then((userId) => {
    req.userId = userId;
    next();
  }, (err) => {
    res.status(401).json({"message": "Invalid session"});
  });
};

module.exports = {
  loggedIn,
};
