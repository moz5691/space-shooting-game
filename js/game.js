var ASSET_URL = '../assets/';
//We first initialize the phaser game object
var WINDOW_WIDTH = 792;
var WINDOW_HEIGHT = 504;
var game = new Phaser.Game(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.AUTO, 'canvas', {
  preload: preload,
  create: create,
  update: GameLoop
});

var WORLD_SIZE = { w: 792, h: 504 };

var water_tiles = [];
var bullet_array = [];

var socket; //Declare it in this scope, initialize in the `create` function
var other_players = {};

var bangSound;
var playerWon = 0; // 1: player won, 2: opponent won
var isGameOver = false;
const LIFE = 100; // set Max Life here.. bigger is stronger.

var player = {
  sprite: null, //Will hold the sprite when it's created
  speed_x: 0, // This is the speed it's currently moving at
  speed_y: 0,
  speed: 0.5, // This is the parameter for how fast it should move
  friction: 0.95,
  shot: false,
  score: LIFE,
  update: function() {
    // Lerp rotation towards mouse
    var dx = game.input.mousePointer.x + game.camera.x - this.sprite.x;
    var dy = game.input.mousePointer.y + game.camera.y - this.sprite.y;
    var angle = Math.atan2(dy, dx) - Math.PI / 2;
    var dir = (angle - this.sprite.rotation) / (Math.PI * 2);
    dir -= Math.round(dir);
    dir = dir * Math.PI * 2;
    this.sprite.rotation += dir * 0.1;

    //Move forward
    if (
      game.input.keyboard.isDown(Phaser.Keyboard.W) ||
      game.input.keyboard.isDown(Phaser.Keyboard.UP)
    ) {
      this.speed_x += Math.cos(this.sprite.rotation + Math.PI / 2) * this.speed;
      this.speed_y += Math.sin(this.sprite.rotation + Math.PI / 2) * this.speed;
    }

    this.sprite.x += this.speed_x;
    this.sprite.y += this.speed_y;

    this.speed_x *= this.friction;
    this.speed_y *= this.friction;

    // Shoot bullet
    if (game.input.activePointer.leftButton.isDown && !this.shot) {
      var speed_x = Math.cos(this.sprite.rotation + Math.PI / 2) * 15;
      var speed_y = Math.sin(this.sprite.rotation + Math.PI / 2) * 15;
      //make shooting sound
      bangSound.play();
      this.shot = true;
      // Tell the server we shot a bullet
      socket.emit('shoot-bullet', {
        x: this.sprite.x,
        y: this.sprite.y,
        angle: this.sprite.rotation,
        speed_x: speed_x,
        speed_y: speed_y
      });
    }
    if (!game.input.activePointer.leftButton.isDown) this.shot = false;

    // To make player flash when they are hit, set player.spite.alpha = 0
    if (this.sprite.alpha < 1) {
      this.sprite.alpha += (1 - this.sprite.alpha) * 0.16;
    } else {
      this.sprite.alpha = 1;
    }

    // Tell the server we've moved
    socket.emit('move-player', {
      x: this.sprite.x,
      y: this.sprite.y,
      angle: this.sprite.rotation,
      score: player.score
    });
  }
};

function CreateShip(type, x, y, angle) {
  // type is an int that can be between 1 and 6 inclusive
  // returns the sprite just created
  var sprite = game.add.sprite(x, y, 'ship' + String(type) + '_1');
  sprite.rotation = angle;
  sprite.anchor.setTo(0.5, 0.5);
  return sprite;
}

function preload() {
  game.load.crossOrigin = 'Anonymous';
  game.stage.backgroundColor = '#3399DA';

  // Load all the ships
  for (var i = 1; i <= 7; i++) {
    game.load.image(
      'ship' + String(i) + '_1',
      ASSET_URL + 'ship' + String(i) + '_1.png'
    );
    game.load.image(
      'ship' + String(i) + '_2',
      ASSET_URL + 'ship' + String(i) + '_2.png'
    );
    game.load.image(
      'ship' + String(i) + '_3',
      ASSET_URL + 'ship' + String(i) + '_3.png'
    );
    game.load.image(
      'ship' + String(i) + '_4',
      ASSET_URL + 'ship' + String(i) + '_4.png'
    );
    game.load.image(
      'ship' + String(i) + '_5',
      ASSET_URL + 'ship' + String(i) + '_4.png'
    );
    game.load.image(
      'ship' + String(i) + '_6',
      ASSET_URL + 'ship' + String(i) + '_4.png'
    );
    game.load.image(
      'ship' + String(i) + '_7',
      ASSET_URL + 'ship' + String(i) + '_4.png'
    );
  }
  // load bullet and background tile
  game.load.image('bullet', ASSET_URL + 'bullet1.png');
  game.load.image('space', ASSET_URL + 'space_tile.png');

  // load sound
  game.load.audio('bangSound', ASSET_URL + 'dark-shoot.wav');
}

function create() {
  // Create water tiles
  for (var i = 0; i <= WORLD_SIZE.w / 72 + 1; i++) {
    for (var j = 0; j <= WORLD_SIZE.h / 72 + 1; j++) {
      var tile_sprite = game.add.sprite(i * 72, j * 72, 'space');
      tile_sprite.anchor.setTo(0.5, 0.5);
      tile_sprite.alpha = 0.5;
      water_tiles.push(tile_sprite);
    }
  }

  scoreText1 = game.add.text(16, 16, 'Good', {
    font: '30px Arial',
    fill: '#7FFF00',
    align: 'center'
  });

  scoreText2 = game.add.text(564, 16, 'Evil', {
    font: '30px Arial',
    fill: '#DC143C',
    align: 'center'
  });

  whoWonBanner = game.add.text(WORLD_SIZE.w / 2, WORLD_SIZE.h / 2, '', {
    font: '60px Arial',
    fill: '#ADFF2F',
    align: 'center'
  });

  var barConfig1 = {
    x: 120,
    y: 70,
    width: 200,
    bg: {
      color: '#651828'
    },
    bar: {
      color: '#FEFF03'
    },
    animationDuration: 200,
    flipped: false
  };

  var barConfig2 = {
    x: 670,
    y: 70,
    width: 200,
    bg: {
      color: '#651828'
    },
    bar: {
      color: '#FEFF03'
    },
    animationDuration: 200,
    flipped: false
  };
  myHealthBar = new HealthBar(this.game, barConfig1);
  oppHealthBar = new HealthBar(this.game, barConfig2);

  whoWonBanner.anchor.setTo(0.5, 0.5);

  // create sound for shooting
  bangSound = game.add.audio('bangSound');

  game.stage.disableVisibilityChange = true;
  // game.sound.setDecodedCallback([bangSound], start, this);
  // Create player
  var player_ship_type = String(4);
  player.sprite = game.add.sprite(
    (Math.random() * WORLD_SIZE.w) / 2 + WORLD_SIZE.w / 2,
    (Math.random() * WORLD_SIZE.h) / 2 + WORLD_SIZE.h / 2,
    'ship' + player_ship_type + '_1'
  );
  player.sprite.anchor.setTo(0.5, 0.5);

  game.world.setBounds(0, 0, WORLD_SIZE.w, WORLD_SIZE.h);

  game.camera.x = player.sprite.x - WINDOW_WIDTH / 2;
  game.camera.y = player.sprite.y - WINDOW_HEIGHT / 2;

  socket = socket = io({
    transports: ['websocket']
  });
  // This triggers the 'connection' event on the server
  socket.emit('new-player', {
    x: player.sprite.x,
    y: player.sprite.y,
    angle: player.sprite.rotation,
    type: 3
  });
  // Listen for other players connecting
  socket.on('update-players', function(players_data) {
    var players_found = {};
    // Loop over all the player data received
    for (var id in players_data) {
      // If the player hasn't been created yet
      if (other_players[id] == undefined && id != socket.id) {
        // Make sure you don't create yourself
        var data = players_data[id];
        var p = CreateShip(data.type, data.x, data.y, data.angle);
        other_players[id] = p;
        console.log('Created new player at (' + data.x + ', ' + data.y + ')');
      }
      players_found[id] = true;

      // Update positions of other players, this is the place check other players' scores.
      if (id != socket.id) {
        other_players[id].target_x = players_data[id].x; // Update target, not actual position, so we can interpolate
        other_players[id].target_y = players_data[id].y;
        other_players[id].target_rotation = players_data[id].angle;

        scoreText2.setText('Opp: ' + players_data[id].score);
        let barPercent = parseInt((players_data[id].score / LIFE) * 100);
        // console.log(barPercent);
        oppHealthBar.setPercent(barPercent);
        if (players_data[id].score < 0) {
          playerWon = 1; // player won.
          game.paused = isGameOver;
          GameOver(playerWon);
          // GameOver(playerWon);
        }
      }
    }
    // Check if a player is missing and delete them
    for (var id in other_players) {
      if (!players_found[id]) {
        other_players[id].destroy();
        delete other_players[id];
      }
    }
  });

  // Listen for bullet update events
  socket.on('bullets-update', function(server_bullet_array) {
    // If there's not enough bullets on the client, create them
    for (var i = 0; i < server_bullet_array.length; i++) {
      if (bullet_array[i] == undefined) {
        bullet_array[i] = game.add.sprite(
          server_bullet_array[i].x,
          server_bullet_array[i].y,
          'bullet'
        );
      } else {
        //Otherwise, just update it!
        bullet_array[i].x = server_bullet_array[i].x;
        bullet_array[i].y = server_bullet_array[i].y;
      }
    }
    // Otherwise if there's too many, delete the extra
    for (var i = server_bullet_array.length; i < bullet_array.length; i++) {
      bullet_array[i].destroy();
      bullet_array.splice(i, 1);
      i--;
    }
  });

  // Listen for any player hit events and make that player flash
  socket.on('player-hit', function(id) {
    if (id == socket.id) {
      //If this is you
      player.sprite.alpha = 0;
      player.score--;
      game.paused = isGameOver;
    } else {
      // Find the right player
      other_players[id].alpha = 0;
    }
    // console.log('score', id, player.score);
    scoreText1.setText('Me: ' + player.score);
    let barPercent = parseInt((player.score / LIFE) * 100);
    console.log(barPercent);
    myHealthBar.setPercent(barPercent);
    // myHealthBar.setPercent((player.score / score) * 100);
    if (player.score < 0) {
      playerWon = 2; // opponent won.
      GameOver(playerWon);
    }
  });
}

function GameLoop() {
  player.update();

  // Move camera with player
  var camera_x = player.sprite.x - WINDOW_WIDTH / 2;
  var camera_y = player.sprite.y - WINDOW_HEIGHT / 2;
  game.camera.x += (camera_x - game.camera.x) * 0.08;
  game.camera.y += (camera_y - game.camera.y) * 0.08;

  // Each player is responsible for bringing their alpha back up on their own client
  // Make sure other players flash back to alpha = 1 when they're hit
  for (var id in other_players) {
    if (other_players[id].alpha < 1) {
      other_players[id].alpha += (1 - other_players[id].alpha) * 0.16;
    } else {
      other_players[id].alpha = 1;
    }
  }

  // Interpolate all players to where they should be
  for (var id in other_players) {
    var p = other_players[id];
    if (p.target_x != undefined) {
      p.x += (p.target_x - p.x) * 0.16;
      p.y += (p.target_y - p.y) * 0.16;
      // Intepolate angle while avoiding the positive/negative issue
      var angle = p.target_rotation;
      var dir = (angle - p.rotation) / (Math.PI * 2);
      dir -= Math.round(dir);
      dir = dir * Math.PI * 2;
      p.rotation += dir * 0.16;
    }
  }
}

function GameOver(playerWon) {
  if (playerWon === 1) {
    // stop game and display banner with player won.
    isGameOver = true;
    whoWonBanner.setText('You won!');
    // game.camera.shake(0.05, 500);
    // game.state.restart(true);
  } else if (playerWon === 2) {
    // stop game and display banner with opponent won.
    isGameOver = true;
    whoWonBanner.setText('You lost!');
    // game.camera.shake(0.05, 500);
    // game.state.restart(true);
  } else {
    // do nothing.
  }
}
