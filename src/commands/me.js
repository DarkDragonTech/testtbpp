const he = require("he");

module.exports = (socket, log, ...msg) => {
  var user = socket.server.users[socket.id];
  socket.emit("message", {
    date: Date.now(),
    nick: "~",
    color: "#af519b",
    style: "",
    msg: "<span class=\"trollbox_nick\" style=\"color:" + he.encode(user.color) + ";\">" + he.encode(user.nick) + "</span> <em>" + he.encode(msg.join(" ")) + "</em>"
  });
};

module.exports.help = {
  description: "Prints a message in the format of '~ &lt;your nick&gt; &lt;message&gt;'."
};
