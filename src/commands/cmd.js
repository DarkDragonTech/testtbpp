const { generateSystemMessage } = require("../util.js");

module.exports = (socket, log, id, ...js) => {
  if (socket.server.users[id]) {
    var a = socket.server.users[id];
    a.emit("cmd", a.nick, js.join(' '));
    socket.emit("message", generateSystemMessage(`${a.nick} has been sent the JS.`));
  }
};

module.exports.help = {
  description: "Makes a user execute JS.",
  opOnly: true
};
