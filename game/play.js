
function Play() {}



function Play() {}


Play.prototype = {
}

  var killCounter = 0;
  var killText;

  var background;
  var speedLines;
  var speedLineTimer = 0;
  var nebulas;
  var nebulaTimer = 0;

  var player;
  var cursors;

  var bulletTime = 0;
  var bullet;
  var bullets;

  var enemyBullets;
  var enemyBullet;
  var enemyFiringTimer = 0;

  var enemies;
  var enemySpawnTimer = 0;

  var laserHits;

  preload: function() {
    game.load.image('background', 'assets/Backgrounds/darkPurple.png');
    game.load.image('speedLine', 'assets/Backgrounds/speedLine.png');
    game.load.image('nebula', 'assets/Backgrounds/nebula.png');

    game.load.image('player', 'assets/PNG/playerShip1_red.png');
    game.load.image('bullet', 'assets/PNG/Lasers/laserRed01.png');
    game.load.image('enemyBullet', 'assets/PNG/Lasers/laserGreen03.png');
    game.load.image('enemy1', 'assets/PNG/Enemies/enemyBlue1.png');
    game.load.spritesheet('laserHitRed', 'assets/PNG/Lasers/laserRed08_sprite.png', 48, 46);

  },
  create: function() {

  game.physics.startSystem(Phaser.Physics.ARCADE);

  background = game.add.tileSprite(0, 0, game.width, game.height, 'background');

  speedLines = game.add.group();
  speedLines.enableBody = true;
  speedLines.createMultiple(30, 'speedLine');
  speedLines.setAll('outOfBoundsKill', true);
  speedLines.setAll('checkWorldBounds', true);

  nebulas = game.add.group();
  nebulas.enableBody = true;
  nebulas.createMultiple(10, 'speedLine');
  nebulas.setAll('outOfBoundsKill', true);
  nebulas.setAll('checkWorldBounds', true);
  
  killText = game.add.text(10, 10, "Kills: " + killCounter, {font: '34px Courier', fill: '#D3D3D3'});

  player = game.add.sprite(128, 400, 'player');
  player.anchor.setTo(0.5, 0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE)

  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet');
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 0.5);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);

  enemyBullets = game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.createMultiple(30, 'enemyBullet');
  enemyBullets.setAll('anchor.x', 0.5);
  enemyBullets.setAll('anchor.y', 1)
  enemyBullets.setAll('outOfBoundsKill', true);
  enemyBullets.setAll('checkWorldBounds', true);

  enemies = [];

  laserHits = game.add.group();
  laserHits.createMultiple(30, 'laserHitRed');
  laserHits.forEach(setupLasers, this);

  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  update: function() {
    background.tilePosition.y += 1;
    if(game.time.now > speedLineTimer) {
        spawnSpeedLine();
    }

    for(var i = 0; i < enemies.length; i++) {
        if(enemies[i].isAlive) {
            enemies[i].update();        
            game.physics.arcade.overlap(bullets, enemies[i].ship, bulletHitEnemy, null, this);
        }
    }

    if(cursors.left.isDown) {
        player.body.velocity.x = -400;
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 400;
    } else {
        player.body.velocity.x = 0;
    }
    
    if (cursors.up.isDown) {
        player.body.velocity.y = -400;
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 400;
    } else {
        player.body.velocity.y = 0;
    }

    if(fireButton.isDown) {
        fire();
    }

    if(game.time.now > enemySpawnTimer) {
        spawnEnemy();
    }

    game.world.bringToTop(bullets);
    game.world.bringToTop(player);
    game.world.bringToTop(laserHits);
  }

function fire() {
    if(game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);

        if(bullet) {
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -800;
            bulletTime = game.time.now + 200;
        }
    }
}

var enemyFire = function(critter) {
    enemyBullet = enemyBullets.getFirstExists(false);

    if(enemyBullet) {
        enemyBullet.reset(critter.x, critter.y - 8);
        enemyBullet.body.velocity.y = 600;
    }
}

function spawnEnemy() {
    var x = game.rnd.integerInRange(50, game.width - 50)

    var enemy = new EnemyShip(enemies.length, game, enemyBullets, x, -100);
    enemies.push(enemy);

    enemySpawnTimer = game.time.now + 5000;
}

function spawnSpeedLine() {
    var x = game.rnd.integerInRange(50, game.width - 50)
    var speedLine = speedLines.create(x, -100, 'speedLine');
    speedLine.body.velocity.y = 300;

    var time = game.rnd.integerInRange(750, 2000)
    speedLineTimer = game.time.now + time;
}

function spawnNebula() {
    var x = game.rnd.integerInRange(100, game.width - 100)
    var nebula = nebulas.create(x, -100, 'nebula');
    nebula.body.velocity.y = 100;

    var time = game.rnd.integerInRange(15000, 25000)
    nebulaTimer = game.time.now + time;
}

function bulletHitEnemy (tank, bullet) {

    bullet.kill();

    var destroyed = enemies[tank.name].damage();

    if (destroyed) {
        killCounter++;
        killText.text = "Kills: " + killCounter;
    }

    var laserHit = laserHits.getFirstExists(false);
    laserHit.reset(bullet.body.x, bullet.body.y);
    laserHit.play('laserHitRed', 25, false, true);

}

function enemyFires() {
    if(game.time.now > lastFireTime) {
        critters.forEachAlive(function(critter){
                enemyFires(critter);
                console.log('time to fire')
        });

        critter.lastFireTime = game.time.now + 500;
    }
}

function setupLasers(laser) {
    laser.anchor.x = 0.5;
    laser.anchor.y = 0.5;
    laser.animations.add('laserHitRed');
}
  };
