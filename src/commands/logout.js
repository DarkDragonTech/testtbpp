const { generateMessage, generateSystemMessage } = require("../util.js");

module.exports = (socket, log, msg) => {
  socket.server.users[socket.id].op = false;
  socket.send(generateSystemMessage("Logged out, use ?!login to log back in."))
};

module.exports.help = {
  opOnly: true,
  description: "Logs out."
}
