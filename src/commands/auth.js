const { generateSystemMessage } = require("../util.js");

module.exports = {
  description: "Commands used for logging in and out of op.",
  commands: {
    login: {
      handler: (socket, log, ...pass) => {
        var password = pass.join(" ");
        if (socket.server.config.password == password) {
          socket.server.users[socket.id].op = true;
          socket.send(generateSystemMessage("Logged in sucessfully."));
          if (socket.server.config.password == "changeme") socket.send(generateSystemMessage("<b>It is highly recommended you change the admin password.</b>"));
        } else {
          socket.server.onlog("WARNING", socket.handshake.address + " attempted to login with a invalid password.", 31)
          socket.send(generateSystemMessage("Password incorrect."));
        }
      },
      hidden: true
    },
    logout: {
      handler: (socket, log, msg) => {
        socket.server.users[socket.id].op = false;
        socket.send(generateSystemMessage("Logged out, use ?!login to log back in."))
      },
      opOnly: true,
      description: "Logs out."
    }
  }
}
