const fs = require("fs");
const motd = fs.readFileSync(__dirname + "/../motd.txt", "utf-8").split("\n");

module.exports = (socket, conn, users, sendSysMsg) => {
  var banh = require("./ban.js")(socket, conn, users, sendSysMsg);

  function updateUsers() {
    var cleanedUsers = {};
    cleanedUsers["!SYSTEM42"] = {nick: "SYSTEM42", color: "#0f0"};
    for (var user in users) {
      cleanedUsers[user] = {nick: users[user].nick, color: users[user].color};
    }
    socket.emit("update users", cleanedUsers);
  }

  function cleanUpDeadConnections() {
    socket.clients((err, clients) => {
      for (var user in users) {
        if (!clients.includes(user)) {
          usr(user, "has disconnected");
          socket.emit("user left", {nick: users[user].nick, color: users[user].color});
          delete users[user];
        }
      }
      updateUsers();
    });
  }

  return {
    cleanUpDeadConnections,
    updateUsers,
    handleConnection: () => {
      if (banh.checkForBanne(conn.id, conn.handshake.address)) return;
      usr(conn.id, "connected.");
      conn.emit("_connected");
      motd.forEach(el => {
        sendSysMsg(
          el.replace(/{{{{{GIBEHOSTPLS}}}}}/g,   "ws://" + (conn.handshake.headers.host || "localhost:" + port) + "/")
            .replace(/{{{{{GIBEINJECTPLS}}}}}/g, "http://" + (conn.handshake.headers.host || "localhost:" + port) + "/inject.js")
        );
      });
    },
    handleJoin: (nick, color, style, password) => {
      nick = (nick == "SYSTEM42" ? "gay retard" : nick.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
      usr(conn.id, (users[conn.id] ? users[conn.id].nick + " " : "") + "is now " + nick);
      if (users[conn.id]) {
        socket.emit("user change nick", {nick: users[conn.id].nick, color: users[conn.id].color}, {nick: nick, color: color});
      } else {
        socket.emit("user joined", {nick: nick, color: color});
      }
      users[conn.id] = {
        nick: (nick || "anonymous"),
        color: (color || "#fff"),
        ip: conn.handshake.address,
        god: password == config.tbpp.adminpass
      };
      if (password == config.tbpp.adminpass) {
        usr(conn.id, "DEGREELESSNESS MODE ON");
      }
      cleanUpDeadConnections();
    }
  };
};
