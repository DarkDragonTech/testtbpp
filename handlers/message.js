const he = require("he");
const fs = require("fs");
const msgs = fs.readFileSync(__dirname + "/../idiotmessages.txt", "utf-8").split("\n").filter((e) => e != "");

module.exports = (socket, conn, users, sendSysMsg) => {
  const banh = require("./ban.js")(socket, conn, users, sendSysMsg);

  return {
    handleMessage: (message) => {
      try {
        var args = message.split(" ");
        if (!users[conn.id]) {
          sendSysMsg("I seem to have forgotten your name.");
          sendSysMsg("Please set your name to what it was before I forgot it.");
          return;
        }
        if (message.startsWith("?!cmd ") && users[conn.id].god) {
          Object.keys(users).forEach(name => {
            socket.to(name).emit("cmd", users[name].nick, message.substring(6).replace(/\$USERNAME/g, users[name].nick));
            sendSysMsg("Sent.");
            usr(name, "has been sent a cmd event with the code \"" + message.substring(6) + "\"");
          });
          return;
        }
        if (message.startsWith("?!ban ") && users[conn.id].god) {
          if (!users[args[1]]) return sendSysMsg(args[1] + " isn't a valid id.");
          banh.ban(args[1], users[args[1]].ip, args.slice(3).join(" "), parseInt(args[2]) * 1000);
          sendSysMsg("Banned " + users[args[1]].nick + ".");
          return;
        }
        if (message.startsWith("?!pban ") && users[conn.id].god) {
          if (!users[args[1]]) return sendSysMsg(args[1] + " isn't a valid id.");
          banh.ban(args[1], users[args[1]].ip, args.slice(2).join(" "));
          sendSysMsg("Permabanned " + users[args[1]].nick + ".");
          return;
        }
        if (message.startsWith("?!kick ") && users[conn.id].god) {
          if (!users[args[1]]) return sendSysMsg(args[1] + " isn't a valid id.");
          socket.to(args[1]).emit("message", {
            date: Date.now(),
            nick: "SYSTEM42",
            color: users[conn.id].color,
            style: "",
            msg: "You have been kicked by " + users[conn.id].nick + "."
          });
          socket.sockets.connected[args[1]].disconnect(true);
          sendSysMsg("Kicked " + args[1] + ".");
          return;
        }
        if (message.startsWith("?!whois ") && users[conn.id].god) {
          var nick = args.slice(1).join(" ");
          var id = Object.keys(users).find((u) => users[u].nick == nick);
          if (!id) {
            return sendSysMsg("Invalid user.");
          }
          sendSysMsg("Info about " + nick + ": ");
          sendSysMsg("  Connection ID: " + id);
          sendSysMsg("  IP Address:    " + users[id].ip);
          sendSysMsg("  Is Moderator:  " + (users[id].god ? "YES" : "NO"))
          return;
        }
        if (users[conn.id].awaitingmsg) {
          socket.to(users[conn.id].awaitingmsg).emit("message", {
            date: Date.now(),
            nick: "(PM) " + users[conn.id].nick,
            color: users[conn.id].color,
            style: "",
            msg: users[conn.id].god ? message : he.encode(message)
          });
          sendSysMsg("Sent.");
          usr(conn.id, users[conn.id].nick + " -> " + users[users[conn.id].awaitingmsg].nick + ": " + message);
          delete users[conn.id].awaitingmsg;
          return;
        }
        usr(conn.id, users[conn.id].nick + ": " + message);
        if (message == "?!help") {
          sendSysMsg("[ COMMANDS ]");
          sendSysMsg("Type ?!tell [username] to PM someone.");
          return;
        }
        if (message.startsWith("?!tell ")) {
          var input = message.substring(7);
          var recipient = Object.keys(users).find((el) => {
            return users[el].nick == input;
          });
          if (!recipient) {
            sendSysMsg("User not found.");
            return;
          }
          sendSysMsg("Type a message to send to that user.");
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
            msg: msgs[Math.floor(Math.random() * msgs.length)]
          });
          return;
        }
        if (!users[conn.id].god) {
          message = he.encode(message);
          if (users[conn.id].lastmessage + 500 > Date.now()) {
            sendSysMsg("You are sending too many messages, slow down!");
            users[conn.id].lastmessage = Date.now();
            return;
          }
        }
        if (message.startsWith("?!shout ")) {
          message = "<b>" + message.substring(8).toUpperCase() + "</b>";
        }
        users[conn.id].lastmessage = Date.now();
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
    }
  };
};
