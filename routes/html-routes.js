const path = require("path");

module.exports = function(app) {
  // Sends homepage to client
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
  // Sends test to client
  app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/game.html"));
  });
  // Sends test to client
  app.get("/intro", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/intro.html"));
  });
};
