const fs = require("fs");
const motd = fs.readFileSync(__dirname + "/../motd.txt", "utf-8").split("\n");

module.exports = (socket, conn, users, sendSysMsg) => {
  var banh = require("./ban.js")(socket, conn, users, sendSysMsg);

  function updateUsers() {
    var cleanedUsers = {};
    var mods = Object.keys(users).filter(e => users[e].god);
    var notmods = Object.keys(users).filter(e => !users[e].god);
    cleanedUsers["!!!00_SYSTEM42"] = {nick: "SYSTEM42", color: "#0f0"};
    if (mods.length > 0) {
      cleanedUsers["!!!01_FILLER1"] = {nick: "<b></b>", color: "#000"};
      cleanedUsers["!!!02_MODTAG"] = {nick: "<i style=\"opacity: 0.7;\">ADMINS - " + mods.length + "</i>", color: "#fff"};
      for (var mod in mods) {
        cleanedUsers["!!" + mods[mod]] = {nick: users[mods[mod]].nick, color: users[mods[mod]].color};
      }
    }
    if (notmods.length > 0) {
      cleanedUsers["!!00_FILLER2"] = {nick: "<b></b>", color: "#000"};
      cleanedUsers["!!01_USRTAG"] = {nick: "<i style=\"opacity: 0.7;\">ONLINE - " + notmods.length + "</i>", color: "#fff"};
      for (var user in notmods) {
        cleanedUsers[notmods[user]] = {nick: users[notmods[user]].nick, color: users[notmods[user]].color};
      }
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
