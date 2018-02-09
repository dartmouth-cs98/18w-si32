const session = require("./session");

// middleware that passes if user is logged in
const loggedIn = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Auth required" });
  }

  const token = req.headers.authorization.replace("Bearer ", "");
  session.get(token).then(
    userId => {
      req.userId = userId;
      req.token = token;
      next();
    },
    err => {
      res.status(401).json({ message: "Invalid session" });
    }
  );
};

const workerAuth = (req, res, next) => {
  return next() // NOTE: right now we dont care about worker actually authenticating, but remove this before prod

  if (!req.headers.w_access_token) {
    return res.status(401).json({ message: "Auth required" });
  }

  const token = req.headers.w_access_token
  const acceptedToken = process.env.W_ACCESS_TOKEN
  if (acceptedToken && token === acceptedToken) { // make sure env variable actually set!
    next()
  } else {
    res.status(401).json({ message: "Invalid session" });
  }
}

module.exports = {
  loggedIn,
  workerAuth
};
