const { generateSystemMessage } = require("../util.js");

module.exports = (socket, log) => {
  socket.emit("message", generateSystemMessage(socket.server.motd.replace(/{HOST}/g, "//" + socket.handshake.headers.host + "/")));
};
