/* eslint-disable */

const width = document.body.offsetWidth;
const height = document.body.offsetHeight;
const shipNumber = sessionStorage.getItem('shipType');

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width,
  height,
  backgroundColor: '#a1f2ec',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 300,
      },
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

let platforms;
let cursors;
let ship;
let tutorialText;
let music;
let camera;

const game = new Phaser.Game(config);

function preload() {
  this.load.spritesheet('otherPlayer', 'assets/player-sprite/otherdude.png', {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.spritesheet('dude', 'assets/player-sprite/dude.png', {
    frameWidth: 32,
    frameHeight: 48,
  });

  for (let i = 1; i <= 7; i++) {
    this.load.image(`ship_${String(i)}`, `assets/ship_${String(i)}.png`);
  }
  // background
  this.load.image('ground', 'assets/player-sprite/platform.png');
  this.load.image('background', 'assets/Magic-Cliffs-Environment/PREVIEWS/magic-cliffs.png');
  this.load.image('sky', 'assets/Magic-Cliffs-Environment/PNG/sky.png');
  this.load.image('clouds', 'assets/Magic-Cliffs-Environment/PNG/clouds.png');
  this.load.audio('landingTheme', 'assets/sad.mp3');
  this.load.image('space', `assets/nebula.jpg`);

}

function create() {
  const self = this;
  this.socket = io();

  this.add.image(width - 500, height, 'space');
  platforms = this.physics.add.staticGroup();
  platforms.create(-40, height - 60, 'ground').setScale(5).refreshBody();
  platforms.create(width - (width*0.08), height - 20, 'ground').setScale(1.3).refreshBody();
  this.add.image(800, height - 150, 'background').setScale(1);
  platforms.create(width - 840, height - 490, 'clouds').setScale(1.3);
  const player_ship_type = String(shipNumber); // player ship can be chosen here.
  ship = this.physics.add.image(
    width - 618, height - 450,
    `ship_${player_ship_type}`,
  );
  this.physics.add.collider(ship, platforms);

  camera = this.cameras.add(0, 0, width, height);
  camera.fadeIn(3000, 0, 0, 0);

  music = this.sound.add('landingTheme');
  music.play();

  tutorialText = this.add.text(
    32,
    height - 100,
    'Health and Ammo has been refilled.',
    {
      font: '20px Arial',
      fill: '#fff',
      align: 'center',
    },
  );
  tutorialText.fixedToCamera = true;

  setTimeout(() => {
    tutorialText.setText('Get to the ship to sortie!');
    setTimeout(() => {
      tutorialText.setText('Good luck Pilot!');
      setTimeout(() => {
        tutorialText.setText('');
      }, 3000);
    }, 5000);
  }, 6000);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: 'turn',
    frames: [{
      key: 'dude',
      frame: 4,
    }],
    frameRate: 20,
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 5,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  });

  this.otherPlayers = this.physics.add.group();
  this.socket.on('currentPlayers', (playersList) => {
    Object.keys(playersList).forEach((id) => {
      if (playersList[id].playerId === self.socket.id) {
        addPlayer(self, playersList[id]);
      } else {
        addOtherPlayers(self, playersList[id]);
      }
    });
  });
  this.socket.on('newPlayer', (playerInfo) => {
    addOtherPlayers(self, playerInfo);
  });
  this.socket.on('disconnect', (playerId) => {
    self.otherPlayers.getChildren().forEach((otherPlayer) => {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });
  this.socket.on('playerMoved', (playerInfo) => {
    self.otherPlayers.getChildren().forEach((otherPlayer) => {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setRotation(playerInfo.rotation);
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });
  this.cursors = this.input.keyboard.createCursorKeys();
}

function addPlayer(self, playerInfo) {
  self.dude = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'dude').setOrigin(0.5, 0.5);
  self.dude.setBounce(0.2);
  self.dude.setTint(0xFF4C4C);
  self.physics.add.collider(self.dude, platforms);
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5);
  otherPlayer.playerId = playerInfo.playerId;
  otherPlayer.setTint(0x00ffff);
  self.physics.add.collider(otherPlayer, platforms);
  self.otherPlayers.add(otherPlayer);
}

function takeOff() {
  camera.fadeOut(2000, 0, 0, 0);
  setTimeout(() => {
    location.replace('/game');
  }, 2500);
}

function update() {
  const player = this.dude;
  if (player) {
    if (this.cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }

    this.input.keyboard.on('keydown_UP', () => {
      if (player.body.touching.down) {
        player.setVelocityY(-400);
      }
    });

    this.physics.world.wrap(player, 5);
    this.physics.add.overlap(player, ship, takeOff);

    // emit player movement
    const x = player.x;
    const y = player.y;
    if (player.oldPosition && (x !== player.oldPosition.x || y !== player.oldPosition.y)) {
      this.socket.emit('playerMovement', {
        x: player.x,
        y: player.y,
      });
    }
    // save old position data
    player.oldPosition = {
      x: player.x,
      y: player.y,
    };
  }
}
