const User = require("../User.js");
const { generateSystemMessage, updateUserList } = require("../util.js");

module.exports = (socket, log, nick, color, style, password) => {
  log(nick + " joined (" + socket.handshake.address + ")");

  let user = new User(socket, nick, color, style, password);

  if (socket.server.users[socket.id]) {
    socket.io.emit("user change nick", socket.server.users[socket.id].getSafeObject(), user.getSafeObject());
  } else {
    socket.io.emit("user joined", user.getSafeObject());

    socket.emit("message", generateSystemMessage(
      socket.server.motd.replace(/{HOST}/g, "//" + socket.handshake.headers.host + "/")
    ));
  }

  socket.server.users[socket.id] = user;
  updateUserList(socket.io, socket.server.users);
}
