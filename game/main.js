

var game;

window.onload = function() {
    game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'My Phaser Game');
    game.totalKillCounter = 0;

	game.state.add('play', Play);
	game.state.add('menu', Menu);

	game.state.start('menu');
};


