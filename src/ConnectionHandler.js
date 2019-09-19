const User = require("./User.js");

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

  log("connection from " + socket.handshake.address);

  socket.on("user joined", (nick, color, style, password) => {
    log(nick + " joined");

    let user = new User(socket, nick, color, style, password);

    if (socket.server.users[socket.id]) {
      socket.io.emit("user change nick", socket.server.users[socket.id].getSafeObject(), user.getSafeObject());
    } else {
      socket.io.emit("user joined", user.getSafeObject());
    }

    socket.server.users[socket.id] = user;
    updateUserList(socket.io, socket.server.users);
  });

  socket.on("disconnect", () => {
    log("disconnected");

    if (!socket.server.users[socket.id]) return;
    let user = socket.server.users[socket.id];
    socket.io.emit("user left", user.getSafeObject());
    delete socket.server.users[socket.id];
    updateUserList(socket.io, socket.server.users);
  });

  // TODO: implement xss protection
  socket.on("message", msg => {
    log(msg);

    if (!socket.server.users[socket.id]) return;
    console.log(msg);
    let user = socket.server.users[socket.id].getSafeObject();
    socket.io.emit("message", {
      date: Date.now(),
      nick: user.nick,
      color: user.color,
      style: user.style,
      msg: msg
    });
  });
}
