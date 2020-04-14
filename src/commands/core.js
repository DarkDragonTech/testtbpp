const { generateMessage, generateSystemMessage } = require("../util.js");

module.exports = {
  description: "Core commands.",
  commands: {
    help: {
      handler: (socket, log, commands) => {
        let user = socket.server.users[socket.id];

        var paddingArr = Object.keys(commands)
          .filter(s => !commands[s].help.hidden && !(commands[s].help.opOnly && !user.op))
          .map(s => s.length);

        var padding = Math.max(...paddingArr);

        var help = ["== COMMAND LIST =="];
        for (var cmd in commands) {
          if (commands[cmd].help.hidden || (commands[cmd].help.opOnly && !user.op)) {
            continue;
          }

          help.push(socket.server.config.prefix + cmd.padEnd(padding) + " | " + (commands[cmd].help.description || "[ Description not found. ]"));
        }
        socket.send(generateSystemMessage(help.join("\n")));
      },
      description: "Lists all commands."
    },
    motd: {
      handler: (socket, log) => {
        socket.send(generateSystemMessage(socket.server.motd.replace(/{HOST}/g, "//" + socket.handshake.headers.host + "/").replace(/{PREFIX}/g, socket.server.config.prefix)));
      },
      description: "Displays the MOTD of the server."
    },
    r: {
      handler: (socket, log, ...splitMsg) => {
        var target = socket.server.users[socket.id].lastPm;
        var msg = splitMsg.join(" ");

        if (socket.server.users[target]) {
          var user = socket.server.users[socket.id].getSafeObject();
          user.nick = "(PM) " + user.nick;
          socket.to(target).emit("message", generateMessage(user, msg));
        } else {
          socket.send(generateSystemMessage("Nobody to reply to."));
        }
      },
      description: "Replies to a private message."
    },
    tell: {
      handler: (socket, log, id, ...splitMsg) => {
        var msg = splitMsg.join(" ");

        if (socket.id == id) {
          socket.send(generateSystemMessage("You can't send a message to yourself."));
        } else if (socket.server.users[id]) {
          socket.server.users[id].lastPm = socket.id;

          var user = socket.server.users[socket.id].getSafeObject();
          user.nick = "(PM) " + user.nick;
          socket.to(id).emit("message", generateMessage(user, msg));
        } else {
          socket.send(generateSystemMessage("User \"" + id + "\" not found.\nHINT: You must specify an ID instead of a username."));
        }
      },
      description: "Sends a private message."
    },
    users: {
      handler: (socket, log) => {
        var users = [];
        for (var a in socket.server.users) {
          users.push(`<b>${socket.server.users[a].nick}</b> - ${a}`);
        }
        socket.send(generateSystemMessage(users.join("\n")));
      },
      description: "List all users and their IDs."
    }
  }
};
