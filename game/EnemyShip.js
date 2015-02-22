EnemyShip = function(name, game, bullets, x, y) {

    this.x = x;
    this.y = y;

    this.game = game;
    this.bullets = bullets;
    this.health = 3;
    this.nextFire = this.game.time.now + 100;
    this.isAlive = true;
    this.fireRate = 2500;

    this.ship = game.add.sprite(x, y, 'enemy1');
    this.ship.enableBody = true;

    this.ship.name = name.toString();

    game.physics.enable(this.ship, Phaser.Physics.ARCADE);
    this.ship.body.velocity.y = 150;

    this.outOfBoundsKill = true;
    this.checkWorldBounds = true;
}

EnemyShip.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0) {
        this.isAlive = false;
        this.ship.kill();

        return true;
    }

    return false;

}

EnemyShip.prototype.update = function() {

    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
    {
        console.log('fire');
        this.nextFire = this.game.time.now + 2500;

        var bullet = this.bullets.getFirstDead();

        bullet.reset(this.ship.x + 50, this.ship.y + 90);

        bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.ship.x, this.ship.y + 1000);

        bullet.body.velocity.y = 500;
    }

};