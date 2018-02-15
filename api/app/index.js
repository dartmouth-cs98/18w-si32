require("dotenv").config(); // load environment vars from .env

const Koa = require("koa");
const cors = require("@koa/cors");
const koaBody = require("koa-body");

/* eslint-disable no-unused-vars */
const db = require("./db");
/* eslint-enable no-unused-vars */
const fileMiddleware = require("./files/fileMiddleware");

const rootRouter = require("./routes");

const PORT = process.env.PORT || 5000;

const app = new Koa();

app.use(async (ctx, next) => {
  await next();
});

app.use(cors());
app.use(koaBody({multipart: true}));

app.use(fileMiddleware);

app
  .use(rootRouter.routes())
  .use(rootRouter.allowedMethods());


// listen for requests
app.listen(PORT);
// const server = http.createServer(app);
// server.listen(PORT);

/* eslint-disable no-console */
console.log(`Server listening on port ${PORT}`);
/* eslint-enable no-console */

module.exports = app;
