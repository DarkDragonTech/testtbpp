const { generateSystemMessage } = require("../util.js");

module.exports = (socket, log, ...pass) => {
  var password = pass.join(" ");
  if (socket.server.config.password == password) {
    socket.server.users[socket.id].op = true;
    socket.emit("message", generateSystemMessage("Logged in sucessfully."));
  } else {
    socket.server.onlog("WARNING", socket.handshake.address + " attempted to login with a invalid password.", 31)
    socket.emit("message", generateSystemMessage("Password incorrect."));
  }
};

module.exports.help = {
  hidden: true
}
