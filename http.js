const http = require("http");
const fs = require("fs");
const mime = require("mime-types");

const app = http.createServer(async (req, res) => {
  usr("S <- " + (req.headers["x-real-ip"] || req.socket.localAddress), req.method + " " + req.url + (req.httpVersion == "0.9" ? "" : " HTTP/" + req.httpVersion));
  if (req.url.startsWith("/../")) {
    res.writeHead(403, "Nope");
    res.end("Nice try, retard.\n");
  } else if (req.url == "/inject.js") {
    res.writeHead(200, {"Content-Type": "application/javascript"});
    res.end(`/*
 * tbpp ${version} loader
 * written by 1024x2
 *
 * how to use:
 * 1. go to http://windows93.net/trollbox/
 * 2. open up devtools and go to the console
 * 3. paste this into the console
 * 4. hit enter
 */
socket.close();eval(document.getElementById("trollbox").children[5].innerHTML.replace("var socket = io('//www.windows93.net:8081');", "var socket = io('ws://${req.headers.host || "localhost:" + port}');"));`);
  } else {
    var filename = __dirname + "/static" + (req.url == "/" ? "/index.html" : req.url);
    fs.readFile(filename, (err, data) => {
      function printEnd() {
        usr("S -> " + (req.headers["x-real-ip"] || req.socket.localAddress), "HTTP/" + req.httpVersion + " " + res.statusCode + " " + res.statusMessage);
      }
      if (err) {
        if (err.code == "ENOENT") {
          res.writeHead(404);
          res.end("not found lol");
        } else {
          res.writeHead(500);
          res.end("that wasn't supposed to happen\n\n" + err.stack);
        }
        return printEnd(req, res);
      }
      if (req.url == "/") {
        data = data.toString("utf-8")
          .replace(/{{{{{{PUTHOSTHEREPLSSSSS}}}}}}/, "ws://:" + port + "/");
      }
      var type = mime.contentType((req.url == "/" ? "/index.html" : req.url).slice(1)) || "application/octet-stream";
      res.writeHead(200, {"Content-Type": type});
      res.end(data);
      printEnd();
    });
  }
});

module.exports = app;
