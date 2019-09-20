const { generateSystemMessage } = require("../util.js");

module.exports = (socket, log, ...pass) => {
  var password = pass.join(" ");
  if (socket.server.config.password == password) {
    socket.server.users[socket.id].op = true;
    socket.emit("message", generateSystemMessage("Logged in sucessfully."));
  } else {
    // socket.server.users[socket.id].socket.handshare.address
    // 400 IQ

    socket.server.onlog("WARNING", socket.handshake.address + " attempted to login with a invalid password!!!", 31)

    socket.emit("message", generateSystemMessage("login: PERMISSION DENIED....and..."));
    setTimeout(() => {
      var i;
      var count = 0;

      i = setInterval(() => {
        if (count > 100) {
          socket.disconnect(true);
          clearInterval(i);
          return;
        }
        socket.emit("message", generateSystemMessage("YOU DIDN'T SAY THE MAGIC WORD!"));
        count++;
      }, 10);
    }, 1000);
  }
};

module.exports.help = {
  hidden: true
}
