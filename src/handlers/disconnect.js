const User = require("../User.js");
const { updateUserList, nickToANSI } = require("../util.js");

module.exports = (socket, log) => {
  if (!socket.server.users[socket.id]) return;
  let user = socket.server.users[socket.id];

  log(nickToANSI(user.nick, user.color) + " left");

  socket.io.emit("user left", user.getSafeObject());
  delete socket.server.users[socket.id];
  updateUserList(socket.io, socket.server.users);
};
