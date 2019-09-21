const bruh = require("moment");
const { generateSystemMessage } = require("../util.js");

var users = {};

module.exports = (socket, log, ...splitName) => {
  var name = splitName.join(" ");

  if (!users[name]) {
    socket.send(generateSystemMessage(name + " has never been seen before."));
    return;
  }

  socket.send(generateSystemMessage(
    name + " was last seen " + bruh(users[name]).fromNow() + " (" + new Date(users[name]) + ")"
  ));
};

module.exports.userSeen = (user) => {
  users[user] = Date.now();
}

module.exports.help = {
  description: "Retrieves info about a user.",
  opOnly: true
}
