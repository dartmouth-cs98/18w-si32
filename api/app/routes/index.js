const Router = require("koa-router");
const userRouter = require("./userRoutes");
const botRouter = require("./botRoutes");
const workerRouter = require("./workerRoutes");
const matchRouter = require("./matchRoutes");
const groupRouter = require("./groupRoutes");
const leaderboardRouter = require("./leaderboardRoutes");

const rootRouter = new Router();

rootRouter.use("/bots", botRouter.routes(), botRouter.allowedMethods());
rootRouter.use("/matches", matchRouter.routes(), matchRouter.allowedMethods());
rootRouter.use("/users", userRouter.routes(), userRouter.allowedMethods());
rootRouter.use("/worker", workerRouter.routes(), workerRouter.allowedMethods());
rootRouter.use("/groups", groupRouter.routes(), groupRouter.allowedMethods());
rootRouter.use("/leaderboards", leaderboardRouter.routes(), leaderboardRouter.allowedMethods());


module.exports = rootRouter;
