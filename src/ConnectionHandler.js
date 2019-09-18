const User = require("./User.js");

module.exports = function ConnectionHandler(socket) {
  socket.server.onlog("socket - " + socket.id, "connection from " + socket.handshake.address);

  socket.on("user joined", (nick, color, style, password) => {
    var user = new User(socket, nick, color, style, password);

    socket.server.users[socket.id] = user;
  });

  socket.on("disconnect", () => {
    socket.server.onlog("socket - " + socket.id, "disconnected");
    delete socket.server.users[socket.id];
  });
}
