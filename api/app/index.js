require('dotenv').config(); // load environment vars from .env

const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const koaBody = require('koa-body');

const _ = require("lodash");
const fs = require("fs");

const db = require("./db");
const userRouter = require("./users/routes");
const botRouter = require("./bots/routes");
const workerRouter = require("./worker/routes");
const matchRouter = require("./matches/routes");

const PORT = process.env.PORT || 5000;

const app = new Koa();

app.use(cors());
app.use(koaBody({multipart: true}));

const rootRouter = new Router();

rootRouter.use("/bots", botRouter.routes(), botRouter.allowedMethods());
rootRouter.use("/matches", matchRouter.routes(), matchRouter.allowedMethods());
rootRouter.use("/users", userRouter.routes(), userRouter.allowedMethods());
rootRouter.use("/worker", workerRouter.routes(), workerRouter.allowedMethods());

app
  .use(rootRouter.routes())
  .use(rootRouter.allowedMethods());

// middleware to clean up any leftover files
app.use(async ctx => {
  if (!_.isEmpty(ctx.request.body.files)) {
    console.log("deleting remaining files", ctx.request.body.files);
    _.each(ctx.request.body.files, f => {
      fs.unlink(f.path, _.noop);
    });
  }
  // delete any files that were uploaded and not handled elsewhere
  // TODO prevent people from uploading them to begin with
});

// listen for requests
app.listen(PORT);
// const server = http.createServer(app);
// server.listen(PORT);

console.log(`Server listening on port ${PORT}`)

module.exports = app;
