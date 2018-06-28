// put your domain here lol
const domain = "localhost";
const port = 8082;

const colors = require("colors");
const http = require("http");
const crypto = require("crypto");
const moment = require("moment");
const he = require('he');
const version = "v" + require("./package.json").version;
const app = http.createServer((req, res) => {
  console.log(req.method + " " + req.url);
  if (req.url == "/") {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end("<h1>tb++" + version + "</h1>You're probably here for the <a href=\"/inject.js\">injector script</a>.")
  } else if (req.url == "/inject.js") {
    res.writeHead(200, {"Content-Type": "application/javascript"});
    res.end(`/*tbpp ${version} loader (written by 1024x2)*/socket.close();eval(document.getElementById("trollbox").children[5].innerHTML.replace("var socket = io('//www.windows93.net:8081');", "var socket = io('//${domain}:${port}');"));`);
  } else {
    res.writeHead(404);
    res.end("not found lol");
  }
  console.log("HTTP/" + req.httpVersion + " " + res.statusCode + " " + res.statusMessage);
});
const socket = require("socket.io")(app);
const fs = require("fs");

var users = {};

function updateUsers() {
  var cleanedUsers = {};
  cleanedUsers["!SYSTEM42"] = {nick: "SYSTEM42", color: "#0f0"}
  for (var user in users) {
    cleanedUsers[user] = {nick: users[user].nick, color: users[user].color};
  }
  console.log(cleanedUsers);
  socket.emit("update users", cleanedUsers);
}

function cleanUpDeadConnections() {
  socket.clients((err, clients) => {
    for (var user in users) {
      if (!clients.includes(user)) {
        console.log(user + " is dead, time to delet");
        delete users[user];
      }
    }
    updateUsers();
  });
}

socket.on("connection", (conn) => {
  conn.emit("message", {
    date: Date.now(),
    nick: "SYSTEM42",
    color: "#0f0",
    style: "",
    msg: "Welcome to trollbox++!\nType ?!help if you are new here."
  });

  conn.on("message", (message) => {
    try {
      if (!users[conn.id]) {
        conn.emit("message", {
          date: Date.now(),
          nick: "SYSTEM42",
          color: "#0f0",
          style: "",
          msg: "I forgot your name. :(\nTo fix this, change your name to the same thing it was before I forgot it."
        });
        return;
      }
      console.log(message);
      if (users[conn.id].awaitingmsg) {
        socket.to(users[conn.id].awaitingmsg).emit("message", {
          date: Date.now(),
          nick: "(PM) " + users[conn.id].nick,
          color: users[conn.id].color,
          style: "",
          msg: he.encode(message)
        });
        conn.emit("message", {
          date: Date.now(),
          nick: "SYSTEM42",
          color: "#0f0",
          style: "",
          msg: "Sent."
        });
        return;
      }
      if (message == "?!help") {
        conn.emit("message", {
          date: Date.now(),
          nick: "SYSTEM42",
          color: "#0f0",
          style: "",
          msg: `<h1>Welcome to trollbox++!</h1>Here are some commands:
Type ?!tell [username] to PM someone.`
          //lol
        });
      }
      if (message.startsWith("?!tell ")) {
        var input = message.substring(7);
        var recipient = Object.keys(users).find((el) => {
          return users[el].nick == input;
        });
        if (!recipient) {
          conn.emit("message", {
            date: Date.now(),
            nick: "SYSTEM42",
            color: "#0f0",
            style: "",
            msg: "User not found."
          });
          return;
        }
        conn.emit("message", {
          date: Date.now(),
          nick: "SYSTEM42",
          color: "#0f0",
          style: "",
          msg: "Type a message to send to that user."
        });
        users[conn.id].awaitingmsg = recipient;
        return;
      }
      if (message.startsWith("/sin")) {
        conn.emit("message", {
          date: Date.now(),
          nick: users[conn.id].nick,
          color: users[conn.id].color,
          style: "",
          msg: message
        });
        conn.broadcast.emit("message", {
          date: Date.now(),
          nick: users[conn.id].nick,
          color: users[conn.id].color,
          style: "",
          msg: "psst...i'm really fucking stupid"
        });
      }
      if (!users[conn.id].god) {
        message = he.encode(message);
      }
      if (message.startsWith("?!shout ")) {
        message = "<b>" + message.substring(8).toUpperCase() + "</b>";
      }
      console.log(message);
      socket.emit("message", {
        date: Date.now(),
        nick: users[conn.id].nick,
        color: users[conn.id].color,
        style: "",
        msg: message
      });
    } catch (err) {
      conn.emit("message", {
        date: Date.now(),
        nick: err.name,
        color: "#f00",
        style: "",
        msg: err.stack.substring(err.name.length + 2)
      });
    }
  });

  conn.on("user joined", (nick, color, style, password) => {
    nick = (nick == "SYSTEM42" ? "gay retard" : nick);
    console.log(conn.id + (users[conn.id] ? " (" + users[conn.id].nick + ")" : "") + " is now " + nick);
    if (users[conn.id]) {
      socket.emit("user change nick", users[conn.id], {nick: nick, color: color});
      users[conn.id] = {
        nick: (nick || "Nameless"),
        color: (color || "#000")
      };
    } else {
      users[conn.id] = {
        nick: (nick || "Nameless"),
        color: (color || "#000")
      };
      socket.emit("user joined", users[conn.id]);
    }
    if (password == "iddqd") {
      ok("Degreelessness Mode ON for " + conn.id);
      users[conn.id].god = true;
    } else if (password == "incorrect") {
      conn.emit("message", {
        date: Date.now(),
        nick: "SYSTEM42",
        color: "#0f0",
        style: "",
        msg: "Haha, very funny."
      });
      conn.disconnect(true);
    } else if (password != "" || password) {
      conn.emit("message", {
        date: Date.now(),
        nick: "SYSTEM42",
        color: "#0f0",
        style: "",
        msg: "Your password is incorrect."
      });
      conn.disconnect(true);
    }
    updateUsers();
  });

  conn.on("disconnect", (reason) => {
    cleanUpDeadConnections();
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

app.listen(port, () => console.log("Listening on port " + port + " (http://" + domain + ":" + port + "/)"));
