class User {
  constructor(socket, nick, color, style, password) {
    this.socket = socket;

    this.nick = nick || "";
    this.color = color || "";
    this.style = style || "";
    this.password = password || "";
  }

  isGod() {
    return this.password == socket.server.config.password;
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
