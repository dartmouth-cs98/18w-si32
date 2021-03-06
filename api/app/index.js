require("dotenv").config(); // load environment vars from .env

const Koa = require("koa");
const cors = require("@koa/cors");
const koaBody = require("koa-body");

const socket = require("./lib/socket");

/* eslint-disable no-unused-vars */
const db = require("./db");
/* eslint-enable no-unused-vars */
const fileMiddleware = require("./files/fileMiddleware");
const { errorMiddleware } = require("./errors");

const rootRouter = require("./routes");

const PORT = process.env.PORT || 5000;

const app = new Koa();

app.use(errorMiddleware);
app.use(cors());
app.use(koaBody({
  multipart: true,
  jsonLimit: "15mb", // TODO we definitely want to turn this down, but needed for logs right now
}));

app.use(fileMiddleware);

app
  .use(rootRouter.routes())
  .use(rootRouter.allowedMethods());



// create the server and start listening!
const server = require("http").createServer(app.callback());
socket.init(server); // initialize the websocket
server.listen(PORT);


/* eslint-disable no-console */
console.log(`Server listening on port ${PORT}`);
/* eslint-enable no-console */

module.exports = app;
