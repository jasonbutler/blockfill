var Game = Game || {};

Game.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
Game.Boot.prototype = {
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/winner-banner.png');
    this.load.image('preloadLogo', 'assets/images/logo.png');
    //this.load.image('preloadSplash', 'assets/images/splashScreen.jpg');
    
  },
  create: function() {
    //loading screen will have a white background
    this.game.stage.backgroundColour = "#333333";

    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // if (this.game.device.desktop) {
    // this.game.scale.maxWidth = 500;
    // this.game.scale.maxHeight = 500;  
    // }
    // else {
    //   this.game.scale.maxWidth = 1000;
    //   this.game.scale.maxHeight = 1000;
    // }
    
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //screen size will be set automatically
    this.scale.setScreenSize(true);

    //physics system
    //this.game.physics.startSystem(Phaser.Physics.ARCADE);
  
    this.state.start('Preload');
  }
};