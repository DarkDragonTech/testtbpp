const rgba = require("color-rgba");

// Thanks to ziad87 for this function
function colorAlgo(name) {
  const COLORS = [
    "#e21400",
    "#f78b00",
    "#f8a700",
    "#f78b00",
    "#58dc00",
    "#c3ff00",
    "#a8f07a",
    "#4ae8c4",
    "#3b88eb",
    "#ff00ff",
    "#a700ff",
    "#d300e7"
  ];

  let hash = 7;
  for (let i = 0; i < name.length; i++) {
    hash = n.charCodeAt(i) + (hash<<5) - hash;
  }
  return COLORS[Math.abs(hash % COLORS.length)];
}

module.exports = {
  generateMessage(user, msg) {
    if (user.getSafeObject) user = user.getSafeObject();
    return {
      date: Date.now(),
      nick: user.nick || "anonymoose",
      color: user.color || colorAlgo(),
      style: user.style || ,
      msg: msg
    }
  },
  generateSystemMessage(msg) {
    return {
      date: Date.now(),
      nick: "~",
      color: "#af519b",
      style: "",
      msg: msg
    }
  },
  updateUserList(io, users) {
    let result = {};
    for (let user in users) {
      result[user] = users[user].getSafeObject();
    }
    io.emit("update users", result);
  },
  nickToANSI(nick, color) {
    let [r, g, b] = rgba(color);

    return "\x1b[38;2;" + r + ";" + g + ";" + b + "m" + nick + "\x1b[0m"
  }
};
