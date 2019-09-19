const User = require("../User.js");
const { generateMessage, generateSystemMessage } = require("../util.js");

// TODO: implement xss protection
module.exports = (socket, log, msg) => {
  if (!socket.server.users[socket.id]) return;
  let user = socket.server.users[socket.id].getSafeObject();

  log("<" + user.nick + "> " + msg);

  if (msg == '?!motd') {
  	socket.emit("message", require("../util.js").generateSystemMessage(
    	socket.server.motd.replace(/{HOST}/g, "//" + socket.handshake.headers.host + "/")
  	));
  } else {
  	socket.io.emit("message", generateMessage(user, socket.server.users[socket.id].isGod(socket) ? msg : require("xss")(msg)));
  }
};
