const Router = require("koa-router");
const userRouter = require("./userRoutes");
const botRouter = require("./botRoutes");
const workerRouter = require("./workerRoutes");
const matchRouter = require("./matchRoutes");

const rootRouter = new Router();

rootRouter.use("/bots", botRouter.routes(), botRouter.allowedMethods());
rootRouter.use("/matches", matchRouter.routes(), matchRouter.allowedMethods());
rootRouter.use("/users", userRouter.routes(), userRouter.allowedMethods());
rootRouter.use("/worker", workerRouter.routes(), workerRouter.allowedMethods());

module.exports = rootRouter;
