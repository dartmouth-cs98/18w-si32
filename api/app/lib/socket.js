let io;

const init = (server) => {
  io = require("socket.io")(server);

  io.on("connection", (socket) => {
    socket.on("waitingMatch", (matchId) => {
      socket.join(matchId);
    });

    socket.on("leaveMatch", (matchId) => {
      socket.leave(matchId);
    });
  });
};

const matchResults = (matchId) => {
  io.to(matchId).emit("matchResults");
};

const matchStarted = (matchId) => {
  io.to(matchId).emit("matchStarted");
};

module.exports = {
  init,
  matchResults,
  matchStarted,
};
