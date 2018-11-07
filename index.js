const colors = require("colors"); // eslint-disable-line no-unused-vars
const fs = require("fs");
const ini = require("ini");
const config = global.config =  ini.parse(fs.readFileSync(__dirname + "/config.ini", "utf-8"));
const port = global.port = config.tbpp.port;
const version = global.version = "v" + require("./package.json").version;

var usr = global.usr = (user, text) => {
  user = user.substring(0, 20);
  console.log(("[" + user.padStart(20) + "]").green + " " + text);
};

var log = global.log = (text) => {
  usr("=======SERVER=======", text);
};

log(`Starting tbpp ${version}...`);
const app = require("./http.js");
const socket = require("./socket.js")(app);
if(config.https.enabled === true) log(`Running with HTTPS enabled.`); else log(`Running without HTTPS enabled.`);

process.on("uncaughtException", (err) => {
  log("==== FATAL ERROR! ====");
  log("tbpp has encountered a fatal error and must shut down.");
  log("Here are some error details:");
  log("");
  err.stack.split("\n").forEach((e) => log(e));
  log("Exiting...");
  process.exit(1);
});

process.on("SIGINT", () => {
  process.stdout.write("\r");
  log("Stopping server...");
  socket.emit("message", {
    date: Date.now(),
    nick: "SYSTEM42",
    color: "#0f0",
    style: "",
    msg: "The server is stopping!"
  });
  socket.close();
  log("Stopped server.");
  process.exit(0);
});
let ptcl = "";
if(config.https.enabled === true) ptcl = "https://"; else ptcl = "http://"
app.listen(port, () => log("Listening on port " + port + ` (${ptcl}localhost:` + port + "/)"));
