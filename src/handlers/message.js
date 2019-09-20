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
    if (commands[msg.slice(2).split(" ")[0]]) {
      var args = msg.split(" ").slice(1);
      commands[msg.slice(2).split(" ")[0]](socket, log, ...args);
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
