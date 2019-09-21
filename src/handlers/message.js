const fs = require("fs");
const he = require("he");

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

  if (!user.op) {
    if (user.lastMsg == msg || user.lastMsgDate + 2000 > Date.now()) {
      return;
    }
  }


  if (!msg.startsWith("?!login ")) log("<" + user.nick + "> " + msg, true);

  if (msg.startsWith("?!")) {
    var commandName = msg.slice(2).split(" ")[0];
    var command = commands[commandName];

    if (command) {
      var args = msg.split(" ").slice(1);

      // hacky solution
      if (commandName == "help") args = [commands];

      if (command.help.opOnly && !user.op) {
        socket.send(generateSystemMessage("This command is OP only. Did you forget to login?"));
      } else {
        command(socket, log, ...args);
      }
    } else {
      socket.send(generateSystemMessage("Invalid command."))
    }
  } else {
    if (user.op) {
      socket.io.emit("message", generateMessage(user.getSafeObject(), msg));
    } else {
      user.lastMsg = msg;
      user.lastMsgDate = Date.now();

      socket.io.emit("message", generateMessage(user.getSafeObject(), he.encode(msg)));
    }
  }
};
