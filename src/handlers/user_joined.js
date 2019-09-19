const User = require("../User.js");
const { generateSystemMessage, updateUserList } = require("../util.js");

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
      socket.io.emit("user change nick", socket.server.users[socket.id].getSafeObject(), user.getSafeObject());
    } else {
      socket.io.emit("user joined", user.getSafeObject());
    }

    socket.server.users[socket.id] = user;
  } else {
    socket.emit("message", generateSystemMessage(`The username "${nick}" is already being used.`));
  };
  updateUserList(socket.io, socket.server.users);
}
