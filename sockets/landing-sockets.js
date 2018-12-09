module.exports = function (io) {
  const players = {};
  io.on('connection', (socket) => {
    // create a new player and add it to our players object
    players[socket.id] = {
      rotation: 0,
      x: 150,
      y: 400,
      playerId: socket.id,
    };
    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // send the star object to the new player
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', () => {
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerMovement', (movementData) => {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      // emit a message to all players about the player that moved
      socket.broadcast.emit('playerMoved', players[socket.id]);
    });
  });
};
