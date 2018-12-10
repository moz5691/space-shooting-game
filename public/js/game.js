/* eslint-disable */

$(document).ready(() => {
  // if user didn't insert username should redirect to main page
  if (sessionStorage.getItem('user') === null) location.replace('/');
});
const ASSET_URL = '/assets/';
// We first initialize the phaser game object
const width = document.body.offsetWidth;
const height = document.body.offsetHeight;
const WINDOW_WIDTH = width;
const WINDOW_HEIGHT = height;
const game = new Phaser.Game(
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  Phaser.AUTO,
  'canvas',
  {
    preload,
    create,
    update: GameLoop,
  },
);

const WORLD_SIZE = { w: 1920, h: 1920 };

const water_tiles = [];
const bullet_array = [];

let socket; // Declare it in this scope, initialize in the `create` function
const other_players = {};

let userName;
let coins;
let coinSound;
let music;
let bangSound;
let whoWonBanner;
let scoreText1;
let scoreText2;
let tutorialText;
let playerWon = 0; // 1: player won, 2: opponent won
let isGameOver = false;
let playerGameOver = false;
let oppGameOver = false;
const maxLife = sessionStorage.getItem('shipLife');
const LIFE = maxLife; // set Max Life here.. bigger is stronger.
const ship = sessionStorage.getItem('shipType');
const shipType = ship; // ship type can be chosen here... 4 means "ship4_1" here.
const startSpeed = sessionStorage.getItem('shipSpeed');

const player = {
  sprite: null, // Will hold the sprite when it's created
  speed_x: 0, // This is the speed it's currently moving at
  speed_y: 0,
  speed: startSpeed, // This is the parameter for how fast it should move
  friction: 0.95,
  shot: false,
  score: LIFE,
  update() {
    // Lerp rotation towards mouse
    const dx = game.input.mousePointer.x + game.camera.x - this.sprite.x;
    const dy = game.input.mousePointer.y + game.camera.y - this.sprite.y;
    const angle = Math.atan2(dy, dx) - Math.PI / 2;
    let dir = (angle - this.sprite.rotation) / (Math.PI * 2);
    dir -= Math.round(dir);
    dir = dir * Math.PI * 2;
    this.sprite.rotation += dir * 0.1;

    // Move forward
    if (
      game.input.keyboard.isDown(Phaser.Keyboard.W)
      || game.input.keyboard.isDown(Phaser.Keyboard.UP)
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
      const speed_x = Math.cos(this.sprite.rotation + Math.PI / 2) * 15;
      const speed_y = Math.sin(this.sprite.rotation + Math.PI / 2) * 15;
      // make shooting sound
      bangSound.play();
      this.shot = true;
      // Tell the server we shot a bullet
      socket.emit('shoot-bullet', {
        x: this.sprite.x,
        y: this.sprite.y,
        angle: this.sprite.rotation,
        speed_x,
        speed_y,
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
      score: player.score,
    });
  },
};

function CreateShip(type, x, y, angle) {
  // type is an int that can be between 1 and 6 inclusive
  // returns the sprite just created
  game.physics.startSystem(Phaser.Physics.ARCADE);
  const sprite = game.add.sprite(x, y, `ship_${String(type)}`);
  sprite.rotation = angle;
  game.physics.arcade.enable(sprite);
  sprite.body.collideWorldBounds = true;
  sprite.body.bounce.setTo(1, 1);
  sprite.anchor.setTo(0.5, 0.5);
  return sprite;
}

function preload() {
  game.load.crossOrigin = 'Anonymous';
  game.stage.backgroundColor = '#3399DA';

  // Load all the ships
  for (let i = 1; i <= 7; i++) {
    game.load.image(`ship_${String(i)}`, `${ASSET_URL}ship_${String(i)}.png`);
  }
  // load bullet and background tile
  game.load.image('bullet', `${ASSET_URL}bullet1.png`);
  game.load.image('space', `${ASSET_URL}nebula.jpg`);
  game.load.image('icon:coin', `${ASSET_URL}coin_icon.png`);
  game.load.spritesheet('coin', `${ASSET_URL}coin_animated.png`, 22, 22);
  // load sound
  game.load.audio('bangSound', `${ASSET_URL}laser.mp3`);
  game.load.audio('sfx:coin', `${ASSET_URL}coin.wav`);
  game.load.audio('boden', `${ASSET_URL}battle.mp3`);
}

function create() {
  game.add.image(0, 0, 'space');
  game.world.setBounds(0, 0, 1920, 1920);
  game.camera.flash('#000000');
  coinSound = game.add.audio('sfx:coin');
  userName = sessionStorage.getItem('user');
  scoreText1 = game.add.text(16, 16, `${userName}`, {
    font: '30px Arial',
    fill: '#7FFF00',
    align: 'center',
  });
  scoreText1.fixedToCamera = true;

  scoreText2 = game.add.text(width - 270, 16, 'Waiting for Players', {
    font: '30px Arial',
    fill: '#DC143C',
    align: 'center',
  });
  scoreText2.fixedToCamera = true;

  tutorialText = game.add.text(
    32,
    height - 100,
    'Press W to move forward and cursors to aim. Tap mouse button to shoot',
    {
      font: '20px Arial',
      fill: '#fff',
      align: 'center',
    },
  );
  tutorialText.fixedToCamera = true;

  setTimeout(() => {
    tutorialText.setText('Collect Coins for Speed Boost and Restore to Max Shield!');
    setTimeout(() => {
      tutorialText.setText('Be the last ship standing!');
      setTimeout(() => {
        tutorialText.setText('');
      }, 3000);
    }, 5000);
  }, 10000);

  choiseLabel = game.add.text(width/2, height - 200, '', {
    font: '30px Gill Sans',
    fill: '#fff',
  });
  choiseLabel.anchor.setTo(0.5, 0.5);
  choiseLabel.fixedToCamera = true;

  whoWonBanner = game.add.text(width/2, height - 600, '', {
    font: '60px Arial',
    fill: '#ADFF2F',
    align: 'center',
  });
  whoWonBanner.fixedToCamera = true;

  const barConfig1 = {
    x: 120,
    y: 70,
    width: 200,
    bg: {
      color: '#ff3b30',
    },
    bar: {
      color: '#5ac8fa',
    },
    animationDuration: 200,
    flipped: false,
  };

  // const barConfig2 = {
  //   x: width - 120,
  //   y: 70,
  //   width: 200,
  //   bg: {
  //     color: "#651828"
  //   },
  //   bar: {
  //     color: "#FEFF03"
  //   },
  //   animationDuration: 200,
  //   flipped: false
  // };

  const myHealthBar = new HealthBar(this.game, barConfig1);
  myHealthBar.barSprite.fixedToCamera = true;
  myHealthBar.bgSprite.fixedToCamera = true;
  myHealthBar.borderSprite.fixedToCamera = true;

  // const oppHealthBar = new HealthBar(this.game, barConfig2);
  // oppHealthBar.barSprite.fixedToCamera = true;
  // oppHealthBar.bgSprite.fixedToCamera = true;
  // oppHealthBar.borderSprite.fixedToCamera = true;

  whoWonBanner.anchor.setTo(0.5, 1.8);
  // create sound for shooting
  bangSound = game.add.audio('bangSound');

  // Background Track
  music = game.add.audio('boden');
  music.volume = 0.5;
  music.play();

  game.stage.disableVisibilityChange = true;
  // game.sound.setDecodedCallback([bangSound], start, this);
  // Create player
  const player_ship_type = String(shipType); // player ship can be chosen here.
  player.sprite = game.add.sprite(
    Math.floor(Math.random() * 1900) + 50,
    Math.floor(Math.random() * 1900) + 50,
    `ship_${player_ship_type}`,
  );
  player.sprite.anchor.setTo(0.5, 0.5);
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.camera.follow(player.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
  game.physics.enable(player.sprite);
  player.sprite.body.collideWorldBounds = true;
  player.sprite.body.bounce.setTo(1, 1);

  // function restartGame() {
  //   // Only act if paused
  //   if (game.paused) {
  //     location.replace('/landing');
  //   }
  // }

  // // Inside game click unpause game
  // game.input.onDown.add(restartGame, self);

  socket = socket = io({
    transports: ['websocket'],
  });
  // This triggers the 'connection' event on the server
  socket.emit('new-player', {
    x: player.sprite.x,
    y: player.sprite.y,
    angle: player.sprite.rotation,
    type: 3,
  });
  // Listen for other players connecting
  socket.on('update-players', (players_data) => {
    const players_found = {};
    // Loop over all the player data received
    for (const id in players_data) {
      // If the player hasn't been created yet
      if (other_players[id] === undefined && id !== socket.id) {
        // Make sure you don't create yourself
        const data = players_data[id];
        const p = CreateShip(data.type, data.x, data.y, data.angle);
        other_players[id] = p;
      }
      players_found[id] = true;

      // Update positions of other players, this is the place check other players' scores.
      if (id !== socket.id) {
        // Update target, not actual position, so we can interpolate
        other_players[id].target_x = players_data[id].x;
        other_players[id].target_y = players_data[id].y;
        other_players[id].target_rotation = players_data[id].angle;
        const playerCount = Object.keys(players_data).length - 1;
        scoreText2.setText(`Enemies Left: ${playerCount}`);
        // scoreText2.setText(`Enemy Shields: ${players_data[id].score}`);
        // const barPercent = parseInt((players_data[id].score / LIFE) * 100);
        // oppHealthBar.setPercent(barPercent);
        if (players_data[id].score === 0) {
          oppGameOver = true;
          playerWon = 1; // player own.
        } else {
          oppGameOver = false;
        }
        if (playerGameOver || oppGameOver) {
          GameOver(playerWon);
        }
      }
    }
    // Check if a player is missing and delete them
    for (const id in other_players) {
      if (!players_found[id]) {
        other_players[id].destroy();
        delete other_players[id];
      }
    }
  });

  socket.on('starLocation', (starLocation) => {
    if (coins) coins.destroy();
    coins = game.add.group();
    const sprite = coins.create(starLocation.x, starLocation.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    // physics (so we can detect overlap with the hero)
    game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    // animations
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
  });

  // Listen for bullet update events
  socket.on('bullets-update', (server_bullet_array) => {
    // If there's not enough bullets on the client, create them
    for (let i = 0; i < server_bullet_array.length; i++) {
      if (bullet_array[i] === undefined) {
        bullet_array[i] = game.add.sprite(
          server_bullet_array[i].x,
          server_bullet_array[i].y,
          'bullet',
        );
      } else {
        // Otherwise, just update it!
        bullet_array[i].x = server_bullet_array[i].x;
        bullet_array[i].y = server_bullet_array[i].y;
      }
    }
    // Otherwise if there's too many, delete the extra
    for (let i = server_bullet_array.length; i < bullet_array.length; i++) {
      bullet_array[i].destroy();
      bullet_array.splice(i, 1);
      i--;
    }
  });

  // Listen for any player hit events and make that player flash
  socket.on('player-hit', (id) => {
    if (id === socket.id) {
      // If this is you
      player.sprite.alpha = 0;
      player.score--;
    } else {
      // Find the right player
      other_players[id].alpha = 0;
    }
    scoreText1.setText(`Shields: ${player.score}%`);
    const barPercent = parseInt((player.score / LIFE) * 100);
    myHealthBar.setPercent(barPercent);
    if (player.score <= 0) {
      playerGameOver = true;
      playerWon = 2;
    }
    if (playerGameOver || oppGameOver) {
      player.sprite.destroy();
      GameOver(playerWon);
    }
  });
}

function GameOver(donePlayer) {
  if (donePlayer === 1) {
    // stop game and display banner with player won.
    // isGameOver = true;
    whoWonBanner.setText('Single Kill');
    setTimeout(() => {
      whoWonBanner.setText('');
    }, 3000);
  } else if (donePlayer === 2) {
    // stop game and display banner with opponent won.
    isGameOver = true;
    music.stop();
    whoWonBanner.setText('You Died!');
    choiseLabel.setText('Respawning back in Base');
    setTimeout(() => {
      game.camera.fade(1);
    }, 2000);
    game.camera.onFadeComplete.add(() => {
        location.replace('/landing');
    })
  }
}

const onCoinCollect = () => {
  coinSound.play();
  coins.destroy();
  player.speed = 1.0;
  player.score = LIFE;
  setTimeout(() => {
    player.speed = startSpeed;
  }, 2000);
  socket.emit('starCollected');
};

function GameLoop() {
  player.update();
  // Move camera with player
  const camera_x = player.sprite.x - WINDOW_WIDTH / 2;
  const camera_y = player.sprite.y - WINDOW_HEIGHT / 2;
  game.camera.x += (camera_x - game.camera.x) * 0.08;
  game.camera.y += (camera_y - game.camera.y) * 0.08;

  // Each player is responsible for bringing their alpha back up on their own client
  // Make sure other players flash back to alpha = 1 when they're hit
  for (const id in other_players) {
    if (other_players[id].alpha < 1) {
      other_players[id].alpha += (1 - other_players[id].alpha) * 0.16;
    } else {
      other_players[id].alpha = 1;
    }
  }

  game.physics.arcade.overlap(player.sprite, coins, onCoinCollect);
  game.physics.arcade.overlap(other_players, coins, onCoinCollect);

  // Interpolate all players to where they should be
  for (const id in other_players) {
    const p = other_players[id];
    if (p.target_x !== undefined) {
      p.x += (p.target_x - p.x) * 0.16;
      p.y += (p.target_y - p.y) * 0.16;
      // Intepolate angle while avoiding the positive/negative issue
      const angle = p.target_rotation;
      let dir = (angle - p.rotation) / (Math.PI * 2);
      dir -= Math.round(dir);
      dir = dir * Math.PI * 2;
      p.rotation += dir * 0.16;
    }
  }
}
