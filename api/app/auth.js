const session = require("./session");
const { AuthError } = require("./errors");

// middleware that passes if user is logged in
const loggedIn = async (ctx, next) => {
  // dont check on pre-flight options requests
  if (ctx.request.method == "OPTIONS") {
    return next();
  }

  const token = (ctx.request.headers.authorization || "").replace("Bearer ", "");

  if (!token) {
    throw new AuthError("No token included");
  }

  const userId = await session.get(token);

  // attach session info to context
  ctx.state.userId = userId;
  ctx.state.token = token;

  console.log(userId, token);

  return next();
};

const workerAuth = async (ctx, next) => {
  // NOTE: right now we dont care about worker actually authenticating, but remove this before prod
  return next();
};

module.exports = {
  loggedIn,
  workerAuth
};
