const path = require('path');

module.exports = function (app) {
  // Sends homepage to client
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
  // Sends test to client
  app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/test.html'));
  });
};
