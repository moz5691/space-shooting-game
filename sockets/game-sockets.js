/* eslint-disable */

module.exports = function (io) {
  const players = {}; // Keeps a table of all players, the key is the socket id
  const bullet_array = []; // Keeps track of all the bullets to update them on the server
  // Tell Socket.io to start accepting connections
  const star = {
    x: Math.floor(Math.random() * 1800) + 200,
    y: Math.floor(Math.random() * 1800) + 200,
  };
  io.set('transports', ['websocket']);
  io.on('connection', (socket) => {
    // Listen for a new player trying to connect
    socket.on('new-player', (state) => {
      players[socket.id] = state;
      // Broadcast a signal to everyone containing the updated players list
      io.emit('update-players', players);
      socket.emit('starLocation', star);
    });

    // Listen for a disconnection and update our player table
    socket.on('disconnect', () => {
      delete players[socket.id];
      io.emit('update-players', players);
    });

    // Listen for move events and tell all other clients that something has moved
    socket.on('move-player', (position_data) => {
      if (players[socket.id] === undefined) return; // Happens if the server restarts and a client is still connected
      players[socket.id].x = position_data.x;
      players[socket.id].y = position_data.y;
      players[socket.id].angle = position_data.angle;
      players[socket.id].score = position_data.score;
      io.emit('update-players', players);
    });

    socket.on('starCollected', () => {
      star.x = Math.floor(Math.random() * 1900) + 50;
      star.y = Math.floor(Math.random() * 1900) + 50;
      io.emit('starLocation', star);
    });

    // Listen for shoot-bullet events and add it to our bullet array
    socket.on('shoot-bullet', (data) => {
      if (players[socket.id] === undefined) return;
      const new_bullet = data;
      data.owner_id = socket.id; // Attach id of the player to the bullet
      bullet_array.push(new_bullet);
    });
  });

  // Update the bullets 60 times per frame and send updates
  function ServerGameLoop() {
    for (let i = 0; i < bullet_array.length; i++) {
      const bullet = bullet_array[i];
      bullet.x += bullet.speed_x;
      bullet.y += bullet.speed_y;

      // Check if this bullet is close enough to hit any player
      for (const id in players) {
        if (bullet.owner_id !== id) {
          // And your own bullet shouldn't kill you
          const dx = players[id].x - bullet.x;
          const dy = players[id].y - bullet.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 70) {
            io.emit('player-hit', id); // Tell everyone this player got hit

            if (players[id].score === 0) {
              delete players[id];
            } else {
              players[id].score--;
            }
          }
        }
      }

      // Remove if it goes too far off screen
      if (
        bullet.x < -10 ||
        bullet.x > 1920 ||
        bullet.y < -10 ||
        bullet.y > 1920
      ) {
        bullet_array.splice(i, 1);
        i--;
      }
    }
    // Tell everyone where all the bullets are by sending the whole array
    io.emit('bullets-update', bullet_array);
  }

  setInterval(ServerGameLoop, 16);
};
