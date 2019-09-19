class User {
  constructor(socket, nick, color, style, pass) {
    this.socket = socket;

    this.nick = require("xss")(nick, {whiteList:{
      a: ["href", "title", "target"],
      b: [],
      i: [],
      u: [],
      s: []
    }}) || "";
    this.color = color || "";
    this.style = style || "";
    this.pass = pass || "";
  }

  isGod(socket) {
    return this.pass == socket.server.config.password;
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
