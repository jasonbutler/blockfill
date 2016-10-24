var Game = Game || {};

Game.PlayState = function(){};


var timerStarted = false;
var GameScoreTotal = 0;
var nextThreshold = 10;
var currentAVGpercent = 0;
var numLives = 3;


Game.PlayState.prototype = {

 

    create: function() {
        console.log("PlayState STARTED")

        this.game.world.setBounds(0, 0, 800, 800);
        //this.game.stage.backgroundColour = "#71c885";

        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
 
        collectSound = this.game.add.audio('collect');
        jumpSound = this.game.add.audio('jump');
        wrongSound = this.game.add.audio('wrong');

        blockParent = this.game.add.group();
        var Xpos = 200;
        var Ypos = 300;
        //add our fillblocks
        for (var i = 0; i < 12; i++) {
            
            var fillItem = new FillBlock(this.game, Xpos, Ypos);
            console.log("added fillItem: " + Xpos + "|" + Ypos)
            blockParent.add(fillItem)
            fillItem.fullSignal.add(this.loseLife,this)
            fillItem.stopSignal.add(this.addPoints,this)

            Xpos += 125;
            if(i == 3 || i == 7){
                Xpos = 200;
                Ypos += 225;
            }
            
        }

        var percBar = this.game.add.graphics(0,0);
        percBar.lineStyle(4,0xffffff,1)
        percBar.drawRect(150,25, 475,50)

        this.powerBar = this.game.add.graphics(150,25);
        this.powerBar.beginFill(0xffffff,1)
        this.powerBar.drawRect(0,0, 475,50)

        
        style = { fill: "#d9663d", align: "left" };
        displayText = this.game.add.text(30, 30, "", style);
        displayText.font = 'Alfa Slab One';
        displayText.fontSize = 28;
        displayText.setShadow(0, 2, 'rgba(0,0,0,0.75)', 1);
        displayText.fixedToCamera = true;

        bonusText = this.GameScoreTotal;
        bonusStyle = { fill: "#d9663d", align: "right" };
        bonusPopupText = this.game.add.text(this.game.world.centerX, 30, bonusText, bonusStyle);
        bonusPopupText.fixedToCamera = true;
        bonusPopupText.anchor.setTo(0.5, 0);
        bonusPopupText.font = 'Alfa Slab One';
        bonusPopupText.setShadow(0, 2, 'rgba(0,0,0,0.75)', 1);
        bonusPopupText.fontSize = 28;

        style = { fill: "#FFFFFF", align: "center" };
        popupText = this.game.add.text(this.game.world.centerX, 150, "", style);
        popupText.anchor.setTo(0.5);
        popupText.angle = -10;
        popupText.font = 'Alfa Slab One';
        popupText.fontSize = 38;
        popupText.setShadow(0, 2, 'rgba(0,0,0,0.75)', 1);
        popupText.alpha = 0;
        // popupTextTween = this.game.add.tween(popupText).to( { alpha: .5 }, 500, Phaser.Easing.Bounce.In, false);
        // hidePopupTextTween = this.game.add.tween(popupText).to( { alpha: 0 }, 260, Phaser.Easing.Bounce.In, false, 1000);
        // popupTextTween.onComplete.add(this.hidePopup, this);


        // Create a custom timer
        gameTimer = this.game.time.create();
        
        // Create a delayed event 1m and 30s from now
        timerEvent = gameTimer.loop(Phaser.Timer.SECOND, this.updateTimer, this);
        //gameTimer.start();
        timeLeft = 30;

        console.log("Playstate created")

    },


    update: function() {

    },

    loseLife: function(){
        this.shakeWorld(10,20);
        numLives--;

        if(numLives == 0){
            blockParent.forEach(function(item){
                item.inputEnabled = false;
                item.filling = false;
                item.fillTween.stop();
            })

            console.log("GAME OVER")
        }

    },

    addPoints: function(inPercentage){
        console.log("tapped a block @: " + inPercentage);

        GameScoreTotal ++;
        this.checkGameLevel(GameScoreTotal);
        displayText.text = GameScoreTotal;
        currentAVGpercent += inPercentage;
        var twoPlacedFloat = parseFloat(currentAVGpercent / GameScoreTotal).toFixed(2);
        this.game.add.tween(this.powerBar.scale).to( {x: (currentAVGpercent/GameScoreTotal) / 100 }, 150, Phaser.Easing.Linear.Out, true);
        //this.powerBar.scale.x = (currentAVGpercent/GameScoreTotal) / 100;
        bonusPopupText.text = twoPlacedFloat + "%";
        //currentAVGpercent = twoPlacedFloat;
    },

    updateTimer: function(){

        //console.log("ticked down one second");
        timeLeft--;
        
        var displayTime = timeLeft;

        if (timeLeft < 10)
        displayTime = '0' + timeLeft;

        displayText.text = "0:" + displayTime;

        if(timeLeft < 1)
        this.endTimer();

    },

    checkGameLevel: function(inAmount){
        if(inAmount >= nextThreshold){
            nextThreshold += 20;
            blockParent.forEach(function(item){
                item.updateThreshold();
            })
        }
    },

    endTimer: function(){
        gameTimer.stop();

        //GameScoreTotal = jumpScore;
        //this.state.start('Results');


    },

    shakeWorld: function(range, duration){
        var shakeWorldCount = duration;
        //this.shakeWorldIntensity = range;
        this.game.time.events.repeat(20, duration, function(){
            var rand1 = this.game.rnd.integerInRange(-range,range);   
            var rand2 = this.game.rnd.integerInRange(-range,range);    
            this.game.world.setBounds(rand1, rand2, this.game.width + rand1, this.game.height + rand2);    
            shakeWorldCount--;    
            if (shakeWorldCount == 0) {
                console.log("finished repetitions of shake world count")       
                this.game.world.setBounds(0, 0, this.game.width, this.game.height);     
            }

        }, this);

        if (navigator.vibrate) {
            navigator.vibrate(750)
        }
    },

    resetSprite: function(fillBlock){
        goalSprite.kill();
        goalSprite.reset(this.game.world.centerX, this.game.world.centerY);
        goalSprite.initSprite();

        this.game.add.tween(goalSprite).to( { alpha: 1 }, 300, Phaser.Easing.Quadratic.Out, true);
        this.game.add.tween(goalSprite.scale).to( { x: 1, y:1 }, 300, Phaser.Easing.Bounce.Out, true);

    },

    nextGameState: function(){
        this.state.start('Results');
    }
};