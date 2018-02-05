const express = require("express");
const bcrypt = require("bcryptjs");

const session = require("../session");
const auth = require("../auth");
const User = require("./model");

const userRouter = express.Router();

// TODO split handlers into independent places?

userRouter.post("/register", (req, res) => {
  // hash the password
  bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
      return User.create({
        // create the user in the db
        username: req.body.username,
        password: hash
      });
    })
    // start a session for them
    .then(u => session.create(u, req.connection.remoteAddress))
    .then(session => {
      res.json({
        created: true,
        session
      });
    })
    .catch(err => {
      return res.json({
        created: false,
        err
      });
    });
});

userRouter.post("/login", (req, res) => {
  let foundUser;

  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        throw new Exception();
      }

      foundUser = user;

      // check password
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(match => {
      if (!match) {
        throw new Exception();
      }

      return session.create(foundUser, req.connection.remoteAddress);
    })
    .then(session => {
      res.json({
        session
      });
    })
    .catch(err => {
      res.status(401).json({
        message: "Couldn't log in"
      });
    });
});

userRouter.post("/logout", auth.loggedIn, (req, res) => {
  session
    .destroy(req.token)
    .then(() => {
      return res.json({
        success: true
      });
    })
    .catch(() => {
      res.json({
        message: "Couldn't find or destroy that session",
        success: false
      });
    });
});

// placeholder simple authed profile endpoint 
userRouter.get("/profile", auth.loggedIn, (req, res) => {
  res.send({ user: req.userId });
});

module.exports = userRouter;
