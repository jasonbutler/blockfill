var Game = Game || {};


Game.game = new Phaser.Game(500, 800, Phaser.AUTO, '');

Game.game.state.add('Preload', Game.Preload);
Game.game.state.add('Boot', Game.Boot);
Game.game.state.add('PlayState', Game.PlayState);

Game.game.state.start('Boot');


