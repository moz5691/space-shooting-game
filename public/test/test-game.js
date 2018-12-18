/**
 * @author Maryam
 * @description game.js file made by phaser 2 
 * @description Dom testing with mocha and chai for more information refer to readme file
 */
describe('start game', function () {
    sessionStorage.setItem('user', 'sara');
    let server;

    beforeEach(function () {
      server = sinon.fakeServer.create();
    });
  
    afterEach(function () {
      server.restore();
    }); 

    it('should use phase 2 library to make a game', function () {
        expect(WORLD_SIZE).to.be.an('object').that.includes({ w: 1920, h: 1920,});
        expect(player).to.be.an('object').that.includes({sprite: null, speed_x: 0, speed_y: 0, speed: startSpeed, friction: 0.95,
        shot: false, score: LIFE});
        expect(CreateShip(3, 10, 10, 15)).to.be.an('object');
  });

    it('should put new score to db on gameOver method', function () {
    
        whoWonBanner = game.add.text( 200,  200 * 0.4, "", {
        font: "60px Arial",
        fill: "#ADFF2F",
        align: "center"
      });
      server.respondWith('PUT', '/api/user/sara', [
      200, { 'Content-Type': 'application/json' }, JSON.stringify({username: 'sara', score: 1})
      ]);

      server.respondWith('GET', '/api/user/sara', [
        200, { 'Content-Type': 'application/json' }, JSON.stringify({username: 'sara', score: 1})
      ])

      GameOver(1);
      server.respond();
      expect({username: 'sara', score: 1});
  });
});





