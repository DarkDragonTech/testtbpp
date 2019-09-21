const { generateMessage, generateSystemMessage } = require("../util.js");

module.exports = (socket, log, id, ...splitMsg) => {
  var msg = splitMsg.join(" ");

  if (socket.id == id) {
    socket.send(generateSystemMessage("You can't send a message to yourself."));
  } else if (socket.server.users[id]) {
    socket.server.users[id].lastPm = socket.id;

    var user = socket.server.users[socket.id].getSafeObject();
    user.nick = "(PM) " + user.nick;
    socket.to(id).emit("message", generateMessage(user, msg));
  } else {
    socket.send(generateSystemMessage("User \"" + id + "\" not found.\nHINT: You must specify an ID instead of a username."));
  }
};

module.exports.help = {
  description: "Sends a private message."
};
