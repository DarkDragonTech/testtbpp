const { generateSystemMessage } = require("../util.js");

module.exports = (socket, log, ...msg) => {
  socket.send(generateSystemMessage(msg.join(' ')))
};

module.exports.help = {
  description: "Announces a message.",
  opOnly: true
};
