const { generateSystemMessage } = require("../util.js");

module.exports = (socket, log) => {
  socket.send(generateSystemMessage(socket.server.motd.replace(/{HOST}/g, "//" + socket.handshake.headers.host + "/")));
};

module.exports.help = {
  description: "Displays the MOTD of the server."
};
