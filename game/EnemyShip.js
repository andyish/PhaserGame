EnemyShip = function(name, game, bullets, x, y) {

    this.x = x;
    this.y = y;

    this.game = game;
    this.bullets = bullets;
    this.health = game.rnd.integerInRange(2, 5);
    this.nextFire = this.game.time.now + 100;
    this.isAlive = true;
    this.fireRate = game.rnd.integerInRange(750, 3000);

    this.ship = game.add.sprite(x, y, 'enemy1');
    this.ship.enableBody = true;

    this.ship.name = name.toString();

    game.physics.enable(this.ship, Phaser.Physics.ARCADE);
    this.ship.body.velocity.y = game.rnd.integerInRange(100, 400);

    this.outOfBoundsKill = true;
    this.checkWorldBounds = true;

    this.updateFunction = new Slow();
    
}

EnemyShip.prototype = {

    damage: function() {

        this.health -= 1;

        if (this.health <= 0) {
            this.isAlive = false;
            this.ship.kill();

            return true;
        }

        return false;
    },

    update: function() {

        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
            this.updateFunction.update(this);
        }
    },

    setStrategy: function(updateFunction) {
        this.updateFunction = updateFunction;
    }

}

var Slow = function() {
    this.update = function(ship) {
        console.log('slow');
        ship.nextFire = ship.game.time.now + ship.fireRate;

        var bullet = ship.bullets.getFirstDead();

        bullet.reset(ship.ship.x + 50, ship.ship.y + 90);

        ship.game.physics.arcade.moveToObject(bullet, ship.ship.x, ship.ship.y + 400);

        bullet.body.velocity.y = 400;
    }
}