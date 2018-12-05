// const db = require('./models');

module.exports = function(io) {
  
  var players = {}; //Keeps a table of all players, the key is the socket id
  var bullet_array = []; // Keeps track of all the bullets to update them on the server
// Tell Socket.io to start accepting connections

io.set('transports', ['websocket']);
io.on('connection', function(socket) {
  // Listen for a new player trying to connect

  socket.on('new-player', function(state) {
    console.log('New player joined with state:', state);
    players[socket.id] = state;
    // Broadcast a signal to everyone containing the updated players list
    io.emit('update-players', players);
  });

  // Listen for a disconnection and update our player table
  socket.on('disconnect', function(state) {
    delete players[socket.id];
    io.emit('update-players', players);
  });

  // Listen for move events and tell all other clients that something has moved
  socket.on('move-player', function(position_data) {
    if (players[socket.id] == undefined) return; // Happens if the server restarts and a client is still connected
    //console.log('move data', position_data);
    players[socket.id].x = position_data.x;
    players[socket.id].y = position_data.y;
    players[socket.id].angle = position_data.angle;
    players[socket.id].score = position_data.score;
    io.emit('update-players', players);
    console.log('players', players);
  });

  // Listen for shoot-bullet events and add it to our bullet array
  socket.on('shoot-bullet', function(data) {
    if (players[socket.id] == undefined) return;
    var new_bullet = data;
    data.owner_id = socket.id; // Attach id of the player to the bullet
    if (Math.abs(data.speed_x) > 20 || Math.abs(data.speed_y) > 20) {
      console.log('Player', socket.id, 'is cheating!');
    }
    bullet_array.push(new_bullet);
  });
});

// Update the bullets 60 times per frame and send updates
function ServerGameLoop() {
  for (var i = 0; i < bullet_array.length; i++) {
    var bullet = bullet_array[i];
    bullet.x += bullet.speed_x;
    bullet.y += bullet.speed_y;

    // Check if this bullet is close enough to hit any player
    for (var id in players) {
      if (bullet.owner_id != id) {
        // And your own bullet shouldn't kill you
        var dx = players[id].x - bullet.x;
        var dy = players[id].y - bullet.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 70) {
          io.emit('player-hit', id); // Tell everyone this player got hit
          // players[id].score--;
          // console.log(players[id]);
        }
      }
    }

    // Remove if it goes too far off screen
    if (
      bullet.x < -10 ||
      bullet.x > 1000 ||
      bullet.y < -10 ||
      bullet.y > 1000
    ) {
      bullet_array.splice(i, 1);
      i--;
    }
  }
  // Tell everyone where all the bullets are by sending the whole array
  io.emit('bullets-update', bullet_array);
}

setInterval(ServerGameLoop, 16);
}