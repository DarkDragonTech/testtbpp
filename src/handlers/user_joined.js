const User = require("../User.js");
const { generateSystemMessage, updateUserList } = require("../util.js");
const seen = require("../commands/seen.js");

module.exports = (socket, log, nick, color, style, pass) => {
  var usernames = [];

  if (socket.server.config.noSameName) {
    usernames = Object.keys(socket.server.users)
      .filter(u => socket.server.users[u].socket.id != socket.id)
      .map(u => socket.server.users[u].nick)
  }

  if (usernames.includes(nick) || nick == "~") {
    socket.emit("message", generateSystemMessage("This nickname is already in use."));
  } else {
    let user = new User(socket, nick, color, style, pass);

    seen.userSeen(nick);

    if (socket.server.users[socket.id]) {
      let oldUser = socket.server.users[socket.id];
      log(oldUser.nick + " changed nick to " + user.nick, true);
      socket.io.emit("user change nick", oldUser.getSafeObject(), user.getSafeObject());
    } else {
       log(user.nick + " joined (" + socket.handshake.address + ")", true);
      socket.io.emit("user joined", user.getSafeObject());
    }
    socket.server.users[socket.id] = user;
    updateUserList(socket.io, socket.server.users);
  }
}
