const bruh = require("moment");
const { generateSystemMessage } = require("../util.js");

var users = {};

module.exports = {
  userSeen(user) {
    users[user] = Date.now();
  },
  description: "A command that checks how long the user has been on",
  commands: {
    seen: {
      handler: (socket, log, ...splitName) => {
        var name = splitName.join(" ");

        if (!users[name]) {
          socket.send(generateSystemMessage(name + " hasn't seen since last restart."));
          return;
        }

        socket.send(generateSystemMessage(
          name + " was last seen " + bruh(users[name]).fromNow() + " (" + new Date(users[name]) + ")"
        ));
      },
      description: "Retrieves how long a user has been on.",
      opOnly: true
    }
  }
};


module.exports.help = {
}
