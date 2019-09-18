const he = require("he");
const serv = require("socket.io")();
const colors = ["#e21400", "#f78b00", "#f8a700", "#f78b00", "#58dc00", "#c3ff00", "#a8f07a", "#4ae8c4", "#3b88eb", "#ff00ff", "#a700ff", "#d300e7"];

var users = {};

// algo reversed by ziad, thx!
function calcColor(name) {
  var hash = 7;
  for (var i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + (hash << 5) - hash;
  }
  return colors[Math.abs(hash % colors.length)];
}

var msg = (id, text) => {
  return {date: Date.now(), nick: users[id].nick, color: users[id].color, msg: text}
};
var sys42msg = (text) => {
  return {date: Date.now(), nick: "SYSTEM42", color: "#0f0", msg: text};
};

serv.on("connection", (s) => {
  s.on("user joined", (nick, color) => {
    var old = users[s.id] || false;
    users[s.id] = {nick, color: color || calcColor(nick)};
    if (old) {
      serv.emit("user change nick", old, users[s.id]);
    } else {
      serv.emit("user joined", users[s.id]);
    }
  });

  s.on("disconnect", () => {
    serv.emit("user left", users[s.id]);
    delete users[s.id];
  });

  s.on("message", (mesg) => {
    if (!users[s.id]) return;
    serv.emit("message", msg(s.id, he.encode(mesg)));
  });
});

serv.listen(8082);
