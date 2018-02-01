const express = require('express');
const http = require('http');
const db = require('./db');

const port = 3000;
const app = express();
const server = http.createServer(app);

app.get('/', (req, res, next) => {
  res.send('hello');
});

server.listen(port);

module.exports = app;
