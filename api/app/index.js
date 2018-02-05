const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const db = require("./db");
const userRouter = require("./users/routes");
const botRouter = require("./bots/routes");

const PORT = process.env.PORT;

const app = express();

app.use(bodyParser.json());

// use all the imported routers
app.use("/users", userRouter);
app.use("/bots", botRouter);

// listen for requests
const server = http.createServer(app);
server.listen(PORT);

module.exports = app;
