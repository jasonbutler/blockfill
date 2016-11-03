var Game = Game || {};

//loading the game assets
Game.Preload = function(){};

WebFontConfig = {
    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: [ 'Alfa+Slab+One:latin' ]
    }
};

Game.Preload.prototype = {
  preload: function() {

    this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    //show loading screen

    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadLogo = this.add.sprite(this.game.world.centerX, 300, 'preloadLogo');
    this.preloadLogo.anchor.setTo(0.5);
 
    style = { fill: "#FFFFFF", align: "center" };
    loadingText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 20, "LOADING", style);
    loadingText.font = 'Alfa Slab One';
    loadingText.fontSize = 18;
    loadingText.setShadow(0, 2, 'rgba(0,0,0,0.5)', 3);
    loadingText.anchor.setTo(0.5);
    
    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.image('SPONGElogo', 'assets/images/spongeLogo1.png');
    this.load.image('blockSprite', 'assets/images/blockSprite.png');
    this.load.image('particle', 'assets/images/particle.png');
    this.load.image('smile', 'assets/images/smile.png');
    this.load.image('half-smile', 'assets/images/half-smile.png');
    this.load.image('no-smile', 'assets/images/no-smile1.png');
    this.load.image('cheer', 'assets/images/cheer.png');
    this.load.image('bliss', 'assets/images/bliss.png');

    //menu
    this.load.image('Next_button', 'assets/images/menu/Next_button.png');
    this.load.image('Replay_button', 'assets/images/menu/Replay_button.png');
    this.load.image('Play_button', 'assets/images/menu/Play_button.png');

    //HUD
    this.load.image('leftButton', 'assets/images/HUD/Left_1.png');
    this.load.image('rightButton', 'assets/images/HUD/Right_1.png');
    this.load.image('jumpButton', 'assets/images/HUD/Jump.png');
    this.load.image('scoreBg', 'assets/images/HUD/Score_timer.png');

    this.load.audio('tapBleep', ['assets/audio/tapBleep.wav']);
    this.load.audio('click', ['assets/audio/buttonClick.mp3']);
    this.load.audio('levelUp', ['assets/audio/levelUp.wav']);
    this.load.audio('impact', ['assets/audio/impact.wav']);
    this.load.audio('combo', ['assets/audio/combo.mp3']);
    this.load.audio('theme', ['assets/audio/theme_2.wav']);
    this.load.audio('miss', ['assets/audio/miss.wav']);
    this.load.audio('activeSound', ['assets/audio/activeSound.wav']);
  },
  create: function() {
    this.state.start('PlayState');
  }
};

