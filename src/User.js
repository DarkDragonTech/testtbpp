const { generateSystemMessage } = require("./util.js");
const he = require("he");

// Thanks to ziad87 for this function
function colorAlgo(name) {
  const COLORS = ["#e21400", "#f78b00", "#f8a700", "#f78b00", "#58dc00", "#c3ff00", "#a8f07a", "#4ae8c4", "#3b88eb", "#ff00ff", "#a700ff", "#d300e7"];

  let hash = 7;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + (hash<<5) - hash;
  }
  return COLORS[Math.abs(hash % COLORS.length)];
}

class User {
  constructor(socket, nick, color, style, pass) {
    this.socket = socket;

    this.nick = he.encode(nick || "anonymous");
    this.color = color || colorAlgo(this.nick);
    this.style = style || "";
    this.pass = pass || "";

    this.op = this.pass == socket.server.config.password;

    this.lastMsg = null;
  }

  getSafeObject() {
    return {
      nick: this.nick,
      color: this.color,
      style: this.style
    }
  }
}

module.exports = User;
