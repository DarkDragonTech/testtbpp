const { generateSystemMessage } = require("../util.js");

module.exports = {
  opOnly: true,
  commands: {
    announce: {
      handler: (socket, log, ...msg) => {
        socket.send(generateSystemMessage(msg.join(' ')))
      },
      description: "Announces a message."
    },
    clearchat: {
      handler: (socket, log) => {
        for (var a in socket.server.users) {
          if (!socket.server.users[a].op) {
            socket.io.emit("cmd", socket.server.users[a].nick, "document.getElementById('trollbox_scroll').innerHTML = ''");
          }
        }
        socket.io.emit("message", generateSystemMessage("The chat history has been cleared by an admin."));
      },
      description: "Clears chat history for everybody except admins."
    },
    cmd: {
      handler: (socket, log, id, ...js) => {
        if (socket.server.users[id]) {
          var target = socket.server.users[id];
          target.socket.emit("cmd", target.nick, js.join(" "));
          socket.send(generateSystemMessage(`${target.nick} has been sent the JS.`));
        }
      },
      description: "Makes a user execute JS.",
      opOnly: true
    }
  },
  cmdAll: {
    handler: (socket, log, ...js) => {
      for (var a in socket.server.users) {
        if (!socket.server.users[a].op) {
          socket.io.emit("cmd", socket.server.users[a].nick, js.join(' '));
        }
      }
      socket.send(generateSystemMessage("Sent the JS to all clients."));
    },
    description: "Makes all users (except admins) execute JS.",
    opOnly: true
  }
}
