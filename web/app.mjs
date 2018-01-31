import express from 'express'
import http from 'http'

const port = 3000;
const app = express();
const server = http.createServer(app);

app.get("/", (req, res, next) => {
  res.send("hello");
});

export default app;

server.listen(port);
