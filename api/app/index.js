const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db = require("./db");
const userRouter = require("./users/routes");
const botRouter = require("./bots/routes");
const workerRouter = require("./worker/routes");

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

// use all the imported routers
app.use("/users", userRouter);
app.use("/bots", botRouter);
app.use("/worker", workerRouter);

// listen for requests
const server = http.createServer(app);
server.listen(PORT);

console.log(`Server listening on port ${PORT}`)

module.exports = app;
