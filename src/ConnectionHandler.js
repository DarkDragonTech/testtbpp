const User = require("./User.js");
const { generateMessage, generateSystemMessage } = require("./util.js");

function updateUserList(io, users) {
  let result = {};
  for (let user in users) {
    result[user] = users[user].getSafeObject();
  }
  io.emit("update users", result);
}

module.exports = function ConnectionHandler(socket) {
  let color = Math.floor(Math.random() * 6) + 31
  let log = (msg) => socket.server.onlog("socket - " + socket.id, msg, color);

  socket.on("user joined", (nick, color, style, password) => {
    log(nick + " joined (" + socket.handshake.address + ")");

    let user = new User(socket, nick, color, style, password);

    if (socket.server.users[socket.id]) {
      socket.io.emit("user change nick", socket.server.users[socket.id].getSafeObject(), user.getSafeObject());
    } else {
      socket.io.emit("user joined", user.getSafeObject());
    }

    socket.emit("message", generateSystemMessage(
      socket.server.motd.replace(/{HOST}/g, "//" + socket.handshake.headers.host + "/")
    ));

    socket.server.users[socket.id] = user;
    updateUserList(socket.io, socket.server.users);
  });

  socket.on("disconnect", () => {
    if (!socket.server.users[socket.id]) return;
    let user = socket.server.users[socket.id];

    log(user.nick + " left");

    socket.io.emit("user left", user.getSafeObject());
    delete socket.server.users[socket.id];
    updateUserList(socket.io, socket.server.users);
  });

  // TODO: implement xss protection
  socket.on("message", msg => {
    if (!socket.server.users[socket.id]) return;
    let user = socket.server.users[socket.id].getSafeObject();

    log("<" + user.nick + "> " + msg);

    socket.io.emit("message", generateMessage(user, msg));
  });
}
