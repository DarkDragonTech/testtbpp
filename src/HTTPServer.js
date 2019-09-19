const fs = require("fs");
const express = require("express");

module.exports = (server) => {
  const app = express();

  app.get("/", async (req, res) => {
    fs.readFile(__dirname + "/../static/index.html", (error, data) => {
      if (error) throw error;
      res.send(data.toString().replace(/{{{{{{PUTHOSTHEREPLSSSSS}}}}}}/, "//:" + server.port + "/"));
    });
  });

  app.use(express.static(__dirname + "/../static/"));

  return app;
};
