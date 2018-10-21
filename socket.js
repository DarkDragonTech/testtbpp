const io = require("socket.io");
var socket;
var users = [];

module.exports = (app) => {
  socket = io(app);

  socket.on("connection", (conn) => {
    function sendSysMsg(text) {
      conn.emit("message", {
        date: Date.now(),
        nick: "SYSTEM42",
        color: "#0f0",
        style: "",
        msg: text
      });
    }

    function loadHandler(name) {
      return require("./handlers/" + name + ".js")(socket, conn, users, sendSysMsg);
    }

    var usrh = loadHandler("user");
    var msgh = loadHandler("message");

    usrh.cleanUpDeadConnections();
    usrh.handleConnection();

    conn.on("message", (message) => {
      msgh.handleMessage(message);
    });

    conn.on("user joined", (nick, color, style, password) => {
      usrh.handleJoin(nick, color, style, password);
    });

    conn.on("disconnect", () => {
      usrh.cleanUpDeadConnections();
    });

    conn.on("error", (err) => {
      conn.emit("message", {
        date: Date.now(),
        nick: err.name,
        color: "#f00",
        style: "",
        msg: err.stack.substring(err.name.length + 2)
      });
    });
  });

  return socket;
};
