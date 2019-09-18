const fs = require("fs");
const express = require("express");

module.exports = (server) => {
  const app = express();

  app.get("/", async (req, res) => {
    let file = await fs.promises.readFile(__dirname + "/../static/index.html", "utf-8");

    res.send(file.replace(/{{{{{{PUTHOSTHEREPLSSSSS}}}}}}/, "//:" + server.port + "/"));
  });

  app.use(express.static(__dirname + "/../static/"));

  return app;
};
