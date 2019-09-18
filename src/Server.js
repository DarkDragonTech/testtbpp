const io = require("socket.io");

const ConnectionHandler = require("./ConnectionHandler.js");
const HTTPServer = require("./HTTPServer.js");

class Server {
  constructor(config) {
    console.log(__dirname);

    this._http = new require("http").Server(HTTPServer(this));
    this._io = io(this._http);

    this.users = {};
    this.onlog = () => {};

    console.log(config);

    this.port = config.port;
    this.password = config.password;
    this.config = config;

    this._io.on("connection", (socket) => {
      socket.server = this;

      ConnectionHandler(socket);
    });
  }

  listen(port, cb) {
    this.port = port;
    this._http.listen(port, cb);
  }
}

module.exports = Server;
