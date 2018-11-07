const io = require("socket.io");
const http = require("http");
const https = require("https");
const fs = require("fs");
var users = [];
var nopehandler = (req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("no");
};

module.exports = (app) => {
  var socket;

  if (config.webclient.port == "same" && config.webclient.enabled) {
    socket = io(app);
  } else {
    var noapp;
    if (config.webclient.usehttps) {
      const credentials = {
        key: fs.readFileSync(config.https.private_key, "utf8"),
        cert: fs.readFileSync(config.https.certificate, "utf8")
      };
      noapp = https.createServer(credentials, nopehandler);
    } else {
      noapp = http.createServer(nopehandler);
    }
    noapp.listen(port);
    socket = io(noapp);
  }

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
      usr(conn.id, "disconnected.");
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
