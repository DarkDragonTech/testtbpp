const { generateSystemMessage } = require("../util.js");

module.exports = (socket, log) => {
  var users = [];
  for (var a in socket.server.users) {
    users.push(`<b>${socket.server.users[a].nick}</b> - ${a}`);
  }
  socket.emit("message", generateSystemMessage(users.join("\n")));
};

module.exports.help = {
  description: "List all users and their IDs.",
};
