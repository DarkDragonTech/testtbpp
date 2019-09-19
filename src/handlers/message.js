const User = require("../User.js");
const { generateMessage, generateSystemMessage } = require("../util.js");

// TODO: implement xss protection
module.exports = (socket, log, msg) => {
  if (!socket.server.users[socket.id]) return;
  let user = socket.server.users[socket.id].getSafeObject();

  log("<" + user.nick + "> " + msg);

  socket.io.emit("message", generateMessage(user, msg));
};
