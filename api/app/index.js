require('dotenv').config(); // load environment vars from .env
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const busboyBodyParser = require('busboy-body-parser');
const db = require("./db");
const userRouter = require("./users/routes");
const botRouter = require("./bots/routes");
const workerRouter = require("./worker/routes");
const matchRouter = require("./matches/routes");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(morgan('tiny'));

// turn on CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(bodyParser.json());
app.use(busboyBodyParser());

// use all the imported routers
app.use("/users", userRouter);
app.use("/bots", botRouter);
app.use("/worker", workerRouter);
app.use("/matches", matchRouter);

// listen for requests
const server = http.createServer(app);
server.listen(PORT);

console.log(`Server listening on port ${PORT}`)

module.exports = app;
