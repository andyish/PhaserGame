
function Play() {}


var killCounter = 0;
var killText;

var background;
var clouds1;
var clouds2;
var clouds3;
var speedLineTimer = 0;

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
var enemySpawnCounter = 0;

var laserHits;
var explosions;

Play.prototype = {

  preload: function() {
    game.load.image('background', 'assets/Backgrounds/sea.png');
    game.load.image('cloud1', 'assets/cloud1.png');
    game.load.image('cloud2', 'assets/cloud2.png');
    game.load.image('cloud3', 'assets/cloud3.png');

    game.load.image('player', 'assets/P38_lvl_0_d0.png');
    game.load.image('bullet', 'assets/bullet_2_orange.png');
    game.load.image('enemyBullet', 'assets/bullet_2_blue.png');
    game.load.image('enemy1', 'assets/Aircraft_01.png');
    game.load.image('enemy1_hit', 'assets/Aircraft_01_hit.png');
    game.load.spritesheet('laserHitRed', 'assets/bullet_orange.png', 12, 12);
    game.load.spritesheet('explosion8', 'assets/explosion8.png', 128, 128);

  },
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    background = game.add.tileSprite(0, 0, game.width, game.height, 'background');

    clouds1 = game.add.group();
    clouds1.enableBody = true;
    clouds1.createMultiple(30, 'cloud1');
    clouds1.setAll('outOfBoundsKill', true);
    clouds1.setAll('checkWorldBounds', true);

    clouds2 = game.add.group();
    clouds2.enableBody = true;
    clouds2.createMultiple(30, 'cloud2');
    clouds2.setAll('outOfBoundsKill', true);
    clouds2.setAll('checkWorldBounds', true);

    clouds3 = game.add.group();
    clouds3.enableBody = true;
    clouds3.createMultiple(30, 'cloud3');
    clouds3.setAll('outOfBoundsKill', true);
    clouds3.setAll('checkWorldBounds', true);;
    
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

    explosions = game.add.group();
    explosions.createMultiple(10, 'explosion8');
    explosions.forEach(setupExplosions, this);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  },
  update: function() {

    background.tilePosition.y += 1;
    if(game.time.now > speedLineTimer) {
      spawnCloud();
    }

    for(var i = 0; i < enemies.length; i++) {
      if(enemies[i].isAlive) {
        enemies[i].update();        
        game.physics.arcade.overlap(bullets, enemies[i].ship, bulletHitEnemy, null, this);
      }
    }

    if(cursors.left.isDown) {
      player.body.velocity.x = -600;
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 600;
    } else {
      player.body.velocity.x = 0;
    }

    if (cursors.up.isDown) {
      player.body.velocity.y = -600;
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
    game.world.bringToTop(explosions);
  },
  init: function() {
    killCounter = 0;
    enemySpawnCounter = 0;
  }

};


  function fire() {
      if(game.time.now > bulletTime) {
          bullet = bullets.getFirstExists(false);
          if(bullet) {
              bullet.reset(player.x - 8, player.y - 8);
              bullet.body.velocity.y = -800;
          }

          bullet = bullets.getFirstExists(false);
          if(bullet) {
              bullet.reset(player.x + 8, player.y - 8);
              bullet.body.velocity.y = -800;
          }

          bulletTime = game.time.now + 100;
      }
  }

  var enemyFire = function(critter) {
      enemyBullet = enemyBullets.getFirstExists(false);

      if(enemyBullet) {
          enemyBullet.reset(critter.x + 12, critter.y - 8);
          enemyBullet.body.velocity.y = 600;
      }
  }

  function spawnEnemy() {
      enemySpawnCounter++;

      var x = game.rnd.integerInRange(50, game.width - 50)

      var enemy = new EnemyShip(enemies.length, game, enemyBullets, x, -100);
      enemies.push(enemy);

      enemySpawnTimer = game.time.now + game.rnd.integerInRange(1500, 3500);
  }

  function spawnCloud() {

    var cloudNum = game.rnd.integerInRange(0, 2);
    var x = game.rnd.integerInRange(50, game.width - 50);
    var cloud;
    var velocity;

    if(cloudNum == 0) {
      cloud = clouds1.create(x, -100, 'cloud1');
      velocity = 200;
    } else if(cloudNum == 1) {
      cloud = clouds2.create(x, -100, 'cloud2');
      velocity = 100;
    } else if(cloudNum == 2) {
      cloud = clouds3.create(x, -100, 'cloud3');
      velocity = 150;
    }

      cloud.body.velocity.y = velocity;

      var time = game.rnd.integerInRange(750, 2000);
      speedLineTimer = game.time.now + time;
  }

  function spawnNebula() {
      var x = game.rnd.integerInRange(100, game.width - 100)
      var nebula = nebulas.create(x, -100, 'nebula');
      nebula.body.velocity.y = 100;

      var time = game.rnd.integerInRange(15000, 25000)
      nebulaTimer = game.time.now + time;
  }

  function bulletHitEnemy (enemy, bullet) {

      bullet.kill();

      var destroyed = enemies[enemy.name].damage();

      if (destroyed) {
          killCounter++;
          killText.text = "Kills: " + killCounter;

          var explosion = explosions.getFirstExists(false);
          explosion.reset(enemy.body.x + enemy.body.width / 2, enemy.body.y + enemy.body.height / 2);
          explosion.play('explosion8', 50, false, true);
      }

      var laserHit = laserHits.getFirstExists(false);
      laserHit.reset(bullet.body.x, bullet.body.y);
      laserHit.play('laserHitRed', 60, false, true);

  }

  function setupLasers(laser) {
      laser.anchor.x = 0.5;
      laser.anchor.y = 0.5;
      laser.animations.add('laserHitRed');
  }
  function setupExplosions(explosion){
      explosion.anchor.x = 0.5;
      explosion.anchor.y = 0.5;
      explosion.animations.add('explosion8');
  }