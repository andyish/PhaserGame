
var button;
var game;

function Menu() {}
  Menu.prototype = {
    preload: function() {
      game.load.image('level1', 'assets/ui/level1.png');
    },
    create: function() {
      game = this.game;

      button = game.add.button(game.world.centerX - 95, 400, 'level1', actionOnClick);




      // var style = { font: '65px Courier', fill: '#ffffff', align: 'center'};
      // this.sprite = this.game.add.sprite(this.game.world.centerX, 300, 'glassPanel');
      // this.sprite.anchor.setTo(0.5, 0.5);
      // this.sprite.scale.set(3, 1);
      // this.sprite.events.onInputDown.add(function event() {
      //   this.game.state.start('play');
      // }, this);

      // this.titleText = this.game.add.text(this.game.world.centerX, 300, 'Level 1', style);
      // this.titleText.anchor.setTo(0.5, 0.5);

      this.instructionsText = game.add.text(this.game.world.centerX, 400, 'Total Kills: ' + game.totalKillCounter, { font: '16px Courier', fill: '#ffffff', align: 'center'});
      this.instructionsText.anchor.setTo(0.5, 0.5);

      // this.sprite.angle = -20;
      // this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
    },
    update: function() {

    },
    restart: function() {

    }
  };

function up() {
    console.log('button up', arguments);
}

function over() {
    console.log('button over');
}

function out() {
    console.log('button out');
}

function actionOnClick () {
    game.state.clearCurrentState();
    game.state.restart()
    game.state.start('play', true, false);
}