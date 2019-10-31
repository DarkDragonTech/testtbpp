const { generateSystemMessage } = require("../util.js");

module.exports = (socket, log, id, ...js) => {
  if (socket.server.users[id]) {
    var target = socket.server.users[id];
    target.socket.emit("cmd", target.nick, js.join(" "));
    socket.send(generateSystemMessage(`${target.nick} has been sent the JS.`));
  }
};

module.exports.help = {
  description: "Makes a user execute JS.",
  opOnly: true
};
