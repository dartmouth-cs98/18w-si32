require('dotenv').config(); // load environment vars from .env

const Koa = require("koa");
const cors = require("@koa/cors");
const koaBody = require('koa-body');

const db = require("./db");
const fileMiddleware = require("./files/fileMiddleware");

const rootRouter = require("./routes");

const PORT = process.env.PORT || 5000;

const app = new Koa();

app.use(async (ctx, next) => {
  console.log(ctx.request.method, ctx.request.path);
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

console.log(`Server listening on port ${PORT}`)

module.exports = app;
