const User = require("../User.js");
const { generateSystemMessage, updateUserList, nickToANSI } = require("../util.js");

module.exports = (socket, log, nick, color, style, pass) => {
  var usernames = [];
  if (require("../../config.json").noSameName) {
    for (var a in socket.server.users) {
      usernames.push(socket.server.users[a].nick);
    };
  }

  if (!usernames.includes(nick)) {
    log(nick + " joined (" + socket.handshake.address + ")");
    let user = new User(socket, nick, color, style, pass);

    if (socket.server.users[socket.id]) {
      let oldUser = socket.server.users[socket.id];
      log(nickToANSI(oldUser.nick, oldUser.color) + " changed nick to " + nickToANSI(nick, color));
      socket.io.emit("user change nick", oldUser.getSafeObject(), user.getSafeObject());
    } else {
       log(nickToANSI(nick, color) + " joined (" + socket.handshake.address + ")");
      socket.io.emit("user joined", user.getSafeObject());
    }
    socket.server.users[socket.id] = user;
  } else {
    socket.emit("message", generateSystemMessage(`The username "${nick}" is already being used.`));
  };
  updateUserList(socket.io, socket.server.users);
}
