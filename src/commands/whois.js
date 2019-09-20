const { generateSystemMessage } = require("../util.js");

module.exports = (socket, log, ...splitName) => {
  var name = splitName.join(" ");

  var results = Object.keys(socket.server.users)
    .filter(user => socket.server.users[user].nick == name)
    .map(user => socket.server.users[user]);

  for (let result of results) {
    socket.emit("message", generateSystemMessage(`== INFO FOR ${result.socket.id} ==
Socket ID  : ${result.socket.id}
IP Address : ${result.socket.handshake.address}
Nickname   : ${JSON.stringify(result.nick)}
Color      : ${JSON.stringify(result.color)}
Style      : ${JSON.stringify(result.style)}
Is OP?     : ${result.op ? "YES" : "NO"}`));
  }
};

module.exports.help = {
  description: "Retrieves info about a user.",
  opOnly: true
}
