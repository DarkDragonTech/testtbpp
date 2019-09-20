const fs = require("fs");
const User = require("../User.js");
const { generateMessage, generateSystemMessage } = require("../util.js");

// load commands
var commands = {};

for (var commandName of fs.readdirSync(__dirname + "/../commands/")) {
  if (!commandName.endsWith(".js")) continue;

  var command = require(__dirname + "/../commands/" + commandName);

  commands[commandName.slice(0, -3)] = command;
}


// TODO: implement xss protection
module.exports = (socket, log, msg) => {
  if (!socket.server.users[socket.id]) return;
  let user = socket.server.users[socket.id];

  if (!msg.startsWith("?!login ")) log("<" + user.nick + "> " + msg, true);

  if (msg.startsWith("?!")) {
    var command = commands[msg.slice(2).split(" ")[0]];
    if (command) {
      var args = msg.split(" ").slice(1);

      if (command.help.opOnly && !user.op) {
        socket.emit("message", generateSystemMessage("This command is OP only. Did you forget to login?"));
      } else {
        command(socket, log, ...args);
      }
    } else if (msg.slice(2).split(" ")[0] == "help") {
      var padding = Math.max(...(
        Object.keys(commands)
          .filter(s => !commands[s].help.hidden)
          .map(s => s.length)
      ));
      var help = ["== COMMAND LIST =="];
      for (var cmd in commands) {
        if (commands[cmd].help.hidden) continue;
        if (commands[cmd].help.opOnly && !user.op) continue;
        help.push("?!" + cmd.padEnd(padding) + " | " + (commands[cmd].help.description || "[ Description not found. ]"));
      }
      socket.emit("message", generateSystemMessage(help.join("\n")));
    } else {
      socket.emit("message", generateSystemMessage("Invalid command."));
    }
  } else {
    if (socket.server.users[socket.id].op) {
      socket.io.emit("message", generateMessage(user.getSafeObject(), msg));
    } else {
      socket.io.emit("message", generateMessage(user.getSafeObject(), require("xss")(msg)));
    }
  }
};
