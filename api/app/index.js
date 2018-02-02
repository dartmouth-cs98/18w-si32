const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

// import all sub routers
const userRouter = require('./users/routes');
const botRouter = require('./bots/routes');

// TODO setup config management
const PORT = 3000;

const app = express();

app.use(bodyParser.json());

// use all the imported routers
app.use('/users', userRouter);
app.use('/bots', botRouter);

// listen for requests
const server = http.createServer(app);
server.listen(PORT);

module.exports = app;
