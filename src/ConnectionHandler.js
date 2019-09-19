const user_joined = require("./handlers/user_joined.js");
const disconnect = require("./handlers/disconnect.js");
const message = require("./handlers/message.js");

module.exports = function ConnectionHandler(socket) {
  function loadHandler(handler) {
    return function(...args) {
      handler(socket, log, ...args)
    }
  }

  let color = Math.floor(Math.random() * 6) + 31
  let log = (msg) => socket.server.onlog("socket - " + socket.id, msg, color);

  socket.on("user joined", loadHandler(user_joined));
  socket.on("disconnect", loadHandler(disconnect));
  socket.on("message", loadHandler(message));
}
