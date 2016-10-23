var Game = Game || {};

Game.PlayState = function(){};


var timerStarted = false;
var targetScore = 50;
var GameScoreTotal = 0;
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


        

        // errorColour = this.game.add.graphics( 0, 0 );
        // errorColour.beginFill(0xd9663d, 1);
        // errorColour.drawRect(0, 0, 800, 800);
        // errorColour.alpha = 0;
        // errorTween = this.game.add.tween(errorColour).to( { alpha: 0 }, 500, Phaser.Easing.Quadratic.Out, false);
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
        

       
        
        style = { fill: "#d9663d", align: "left" };
        displayText = this.game.add.text(15, 15, "", style);
        displayText.font = 'Alfa Slab One';
        displayText.fontSize = 28;
        displayText.setShadow(0, 2, 'rgba(0,0,0,0.75)', 1);
        displayText.fixedToCamera = true;

        bonusText = this.GameScoreTotal;
        bonusStyle = { fill: "#d9663d", align: "right" };
        bonusPopupText = this.game.add.text(440, 15, bonusText, bonusStyle);
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
        //swipe listener

        // var bgRect = this.game.add.graphics( this.game.world.centerX, this.game.world.centerY );
        // bgRect.lineStyle(4,0xFFFFFF,1)
        // bgRect.drawRect(-50, -200, 100, 200);

        // this.fillRect = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY )
        // this.fillRect.anchor.setTo(0.5,1)
        // var fill = this.game.add.graphics( 0, 0 );
        // fill.beginFill(0xFFFFFF, 1);
        // fill.drawRect(-50, -200, 100, 200);
        // this.fillRect.addChild(fill)
        // this.fillRect.scale.y = .5 //this.fillAmount;

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
        //currentAVGpercent = currentAVGpercent += inPercentage.toFixed(12)

        displayText.text = GameScoreTotal;
        currentAVGpercent += inPercentage;
        var twoPlacedFloat = parseFloat(currentAVGpercent / GameScoreTotal).toFixed(2)
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