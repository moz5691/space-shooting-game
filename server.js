const express = require('express'); // Express contains some boilerplate to for routing and such
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const http = require('http');

const server = http.createServer(app);

const io = require('socket.io').listen(server);

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static('public'));
// Routes

// Socket io Routing
require('./sockets/game-sockets')(io);
// API Routes (require from routes file and pass in Express app)
require('./routes/api-routes')(app);
// HTML Routes (require from routes file and pass in Express app)
require('./routes/html-routes')(app);

// Mongoose Connection
mongoose.connect(
  'mongodb://admin:password1@ds117111.mlab.com:17111/heroku_qkzxjhrm',
  { useNewUrlParser: true },
);
mongoose.set('useCreateIndex', true);

// Listen on port 5000
const PORT = process.env.PORT || 5000;
// Start the server
server.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
