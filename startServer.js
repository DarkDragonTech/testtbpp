#!/usr/bin/node

// This script will start up tb++ without needing to fire up a node REPL.
// Useful for scripts like PM2.

const config = require("./config.json");

const Server = require("./src/Server.js");

const server = new Server(config);

server.onlog = (source, text) => {
  console.log("[" + source + "]", text);
};

server.listen(config.port, () => {
  server.onlog("main", "Listening on " + config.port);
});
