const fs = require("fs");
const io = require("socket.io");

const ConnectionHandler = require("./ConnectionHandler.js");
const HTTPServer = require("./HTTPServer.js");

class Server {
  constructor(config) {
    this._http = new require("http").Server(HTTPServer(this));
    this._io = io(this._http);

    this.users = {};
    this.onlog = () => {};

    this.port = config.port;
    this.config = config;

    this.motd = fs.readFileSync(__dirname + "/../motd.txt", "utf-8").trim();

    this._io.on("connection", (socket) => {
      socket.server = this;
      socket.io = this._io;

      ConnectionHandler(socket);
    });
  }

  listen(port, cb) {
    this.port = port;
    this._http.listen(port, cb);
  }
}

module.exports = Server;
