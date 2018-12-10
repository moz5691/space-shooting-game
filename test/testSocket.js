const should = require('should');
const io = require('socket.io-client');



var socketURL = 'http://localhost:5000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

const player1 = {'Username':'Tom'};
const state ={x: 100, y: 100, angle: 0, type: 3}
const bulletInfo = {x: 50, y: 50, angle: 275, speed_x: 0, speed_y: 0}
let client;
describe("socket",function(){

  it('Should broadcast new user once they connect',function(done){
      client = io.connect(socketURL, options);
    
    
    client.on('connect',function(data){
      client.emit('new-player',state);
    });
    client.on('update-players',function(players_data){
        players_data.should.be.type('object');
        should(null).not.be.ok();
        client.disconnect();
        done(); 
    });
  });

  it('Should return object of star location when new user join to the game',function(done){
    client = io.connect(socketURL, options);
  
  
  client.on('connect',function(data){
    client.emit('new-player',state);
  });
  client.on('starLocation',function(star){
      star.should.have.property('x').and.be.a.Number();
      star.should.have.property('y').and.be.a.Number();
      star.should.be.instanceof(Object);
      should(null).not.be.ok();
      client.disconnect();
      done(); 
  });
});


// it('Should update player moving on the page',function(done){
//   client = io.connect(socketURL, options);


// client.on('connect',function(data){
//   client.emit('move-player',{
//     x: 100,
//     y: 200,
//     angle: 15,
//     score: 5,
//   });
// });
// client.on('update-players',function(players_data){
//     players_data.should.be.type('object');
//     should(null).not.be.ok();
//     client.disconnect();
//     done(); 
//   });
// });


it('Should return object with x, y with number type to give location to star',function(done){
  client = io.connect(socketURL, options);


client.on('connect',function(data){
  client.emit('starCollected');
});
client.on('starLocation',function(star){
    star.should.have.property('x').and.be.a.Number();
    star.should.have.property('y').and.be.a.Number();
    star.should.be.instanceof(Object);
    should(null).not.be.ok();
      client.disconnect();
      done(); 
  });
});

it('Should an Array of x, y locations or empty array for bullet locations',function(done){
  client = io.connect(socketURL, options);


client.on('connect',function(data){
  client.emit('shoot-bullet', bulletInfo);
});
client.on('bullets-update',function(server_bullet_array){
  server_bullet_array.should.be.instanceof(Array);
    should(null).not.be.ok();
      client.disconnect();
      done(); 
  });
});

// it('Should an Array of x, y locations or empty array for bullet locations',function(done){
//   client = io.connect(socketURL, options);


// client.on('connect',function(data){
//   client.emit('shoot-bullet', bulletInfo);
// });
// client.on('player-hit',function(server_bullet_array){
//   server_bullet_array.should.be.instanceof(Array);
//     should(null).not.be.ok();
//       client.disconnect();
//       done(); 
//   });
// });


});