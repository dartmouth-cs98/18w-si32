const session = require("./session");

// middleware that passes if user is logged in
const loggedIn = async (ctx, next) => {
  // dont check on pre-flight options requests
  if (ctx.request.method == "OPTIONS") {
    return next();
  }

  const token = (ctx.request.headers.authorization || "").replace("Bearer ", "");

  if (!token) {
    ctx.status = 401;
    ctx.body = { message: "Auth Required" };
    return;
  }

  const userId = await session.get(token);

  if (!userId) {
    ctx.status = 401;
    ctx.body = { message: "Invalid session" };
    return;
  }

  // attach session info to context
  ctx.userId = userId;
  ctx.token = token;

  await next();
};

const workerAuth = async (ctx, next) => {
  return next() // NOTE: right now we dont care about worker actually authenticating, but remove this before prod
}

module.exports = {
  loggedIn,
  workerAuth
};
