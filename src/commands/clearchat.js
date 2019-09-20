const { generateSystemMessage } = require("../util.js");

module.exports = (socket, log) => {
  for (var a in socket.server.users) {
    if (!socket.server.users[a].op) {
      socket.io.emit("cmd", socket.server.users[a].nick, "document.getElementById('trollbox_scroll').innerHTML = ''");
    }
  }
  socket.io.emit("message", generateSystemMessage("Chat history has been cleared by an admin."));
};

module.exports.help = {
  description: "Clears chat history for everybody except admins.",
  opOnly: true
};
