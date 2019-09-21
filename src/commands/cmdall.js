const { generateSystemMessage } = require("../util.js");

module.exports = (socket, log, ...js) => {
  for (var a in socket.server.users) {
    if (!socket.server.users[a].op) {
      socket.io.emit("cmd", socket.server.users[a].nick, js.join(' '));
    }
  }
  socket.send(generateSystemMessage("Sent the JS to all clients."));
};

module.exports.help = {
  description: "Makes all users (except admins) execute JS.",
  opOnly: true
};
