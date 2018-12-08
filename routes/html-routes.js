const path = require("path");

module.exports = function(app) {
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/start.html"));
  });
  app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/game.html"));
  });
  app.get("/intro", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/intro.html"));
  });
  app.get("/index1", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index1.html"));
  });
};
