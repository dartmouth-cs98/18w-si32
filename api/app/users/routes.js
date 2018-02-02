const express = require("express");
const bcrypt = require("bcryptjs");

const session = require("../session");
const User = require("./model");

const userRouter = express.Router();

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
      console.log(err);
      res.status(401).json({
        message: "Couldn't log in",
        err
      });
    });
});

module.exports = userRouter;
