const { generateSystemMessage } = require("../util.js");

module.exports = (socket, log, commands) => {
  let user = socket.server.users[socket.id];

  var paddingArr = Object.keys(commands)
    .filter(s => !commands[s].help.hidden && !(commands[s].help.opOnly && !user.op))
    .map(s => s.length);

  var padding = Math.max(...paddingArr);

  var help = ["== COMMAND LIST =="];
  for (var cmd in commands) {
    if (commands[cmd].help.hidden || (commands[cmd].help.opOnly && !user.op)) continue;
    help.push(socket.server.config.prefix + cmd.padEnd(padding) + " | " + (commands[cmd].help.description || "[ Description not found. ]"));
  }
  socket.send(generateSystemMessage(help.join("\n")));
};

module.exports.help = {
  description: "Lists all commands."
};
