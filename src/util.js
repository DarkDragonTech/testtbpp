module.exports = {
  generateMessage(user, msg) {
    if (user.getSafeObject) user = user.getSafeObject();
    return {
      date: Date.now(),
      nick: user.nick,
      color: user.color,
      style: user.style,
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
  }
};
