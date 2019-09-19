const User = require("../User.js");
const { generateMessage, generateSystemMessage, nickToANSI } = require("../util.js");

// TODO: implement xss protection
module.exports = (socket, log, msg) => {
  if (!socket.server.users[socket.id]) return;
  let user = socket.server.users[socket.id].getSafeObject();

  log("<" + nickToANSI(user.nick, user.color) + "> " + msg);

  if (msg == '?!motd') {
  	socket.emit("message", generateSystemMessage(
    	socket.server.motd.replace(/{HOST}/g, "//" + socket.handshake.headers.host + "/")
  	));
  } else {
    if(socket.server.users[socket.id].isGod(socket)) {
      socket.io.emit("message", generateMessage(user, msg));
    } else {
      socket.io.emit("message", generateMessage(user, require("xss")(msg)));
    }
  }
};
