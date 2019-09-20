#!/usr/bin/node

// This script will start up tb++ without needing to fire up a node REPL.
// Useful for scripts like PM2.

const Server = require("./src/Server.js");

const config = require("./config.json");

const server = new Server(config);

server.onlog = (source, text, color, verbose) => {
  if (verbose && !config.verbose) return;
  color = color || 32;
  console.log("\x1b[" + color + ";1m[" + source + "]\x1b[0m", text);
};

server.listen(config.port, () => {
  server.onlog("main", "Listening on " + config.port);
});
