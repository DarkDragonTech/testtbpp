const { generateMessage, generateSystemMessage } = require("../util.js");

module.exports = (socket, log, ...splitMsg) => {
  var target = socket.server.users[socket.id].lastMsg;
  var msg = splitMsg.join(" ");

  if (socket.server.users[target]) {
    var user = socket.server.users[socket.id].getSafeObject();
    user.nick = "(PM) " + user.nick;
    socket.to(target).emit("message", generateMessage(user, msg));
  } else {
    socket.emit("message", generateSystemMessage("Nobody to reply to."));
  }
};

module.exports.help = {
  description: "Replies to a private message."
};
