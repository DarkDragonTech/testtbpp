const User = require("../User.js");
const { generateSystemMessage, updateUserList, nickToANSI } = require("../util.js");

module.exports = (socket, log, nick, color, style, password) => {
  let user = new User(socket, nick, color, style, password);

  if (socket.server.users[socket.id]) {
    log(nickToANSI(socket.server.users[socket.id].nick, socket.server.users[socket.id].color) + " changed nick to " + nickToANSI(nick, color));

    socket.io.emit("user change nick", socket.server.users[socket.id].getSafeObject(), user.getSafeObject());
  } else {
    log(nickToANSI(user.nick, user.color) + " joined (" + socket.handshake.address + ")");

    socket.io.emit("user joined", user.getSafeObject());

    socket.emit("message", generateSystemMessage(
      socket.server.motd.replace(/{HOST}/g, "//" + socket.handshake.headers.host + "/")
    ));
  }

  socket.server.users[socket.id] = user;
  updateUserList(socket.io, socket.server.users);
}
