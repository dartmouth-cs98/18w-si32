"use strict";

const session = require("./session");

// middleware that passes if user is logged in
const loggedIn = async (ctx, next) => {
  // dont check on pre-flight options requests
  if (ctx.request.method == "OPTIONS") {
    return next();
  }

  const token = (ctx.request.headers.authorization || "").replace("Bearer ", "");

  if (!token) {
    throw new Error("Auth required");
  }

  const userId = await session.get(token);

  // attach session info to context
  ctx.state.userId = userId;
  ctx.state.token = token;

  return next();
};

const workerAuth = async (ctx, next) => {
  return next() // NOTE: right now we dont care about worker actually authenticating, but remove this before prod
}

module.exports = {
  loggedIn,
  workerAuth
};
