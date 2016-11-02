var Game = Game || {};

Game.PlayState = function(){};


var timerStarted = false;
var GameScoreTotal = 0;
var BonusScoreTotal = 0;
var nextThreshold = 10;
var currentAVGpercent = 0;
var numLives = 1;


Game.PlayState.prototype = {

 

    create: function() {
        console.log("PlayState STARTED")

        this.game.world.setBounds(0, 0, 800, 800);
        this.game.stage.backgroundColour = "#333333";
        this.comboMultiplier = 0;

        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
 
        tapSound = this.game.add.audio('tapBleep');
        levelUpSound = this.game.add.audio('levelUp');
        impactSound = this.game.add.audio('impact');

        style = { fill: "#d9663d", align: "center" };
        displayText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "", style);
        displayText.anchor.setTo(0.5);
        displayText.font = 'Alfa Slab One';
        displayText.fontSize = 250;
        displayText.setShadow(0, 2, 'rgba(0,0,0,0.75)', 1);
        displayText.fixedToCamera = true;

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
        this.powerBar.scale.x = 0;

        bonusStyle = { fill: "#d9663d", align: "right" };
        bonusPopupText = this.game.add.text(this.game.world.centerX, 30, "0%", bonusStyle);
        bonusPopupText.fixedToCamera = true;
        bonusPopupText.anchor.setTo(0.5, 0);
        bonusPopupText.font = 'Alfa Slab One';
        bonusPopupText.setShadow(0, 2, 'rgba(0,0,0,0.75)', 1);
        bonusPopupText.fontSize = 28;

        overlay = this.game.add.graphics(0,0);
        overlay.beginFill(0x000000,0.7);
        overlay.drawRect(0,0,this.game.world.width,this.game.world.height)
        overlay.alpha = 0;

        style = { fill: "#FFFFFF", align: "center" };
        popupText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "", style);
        popupText.anchor.setTo(0.5);
        popupText.angle = -5;
        popupText.font = 'Alfa Slab One';
        popupText.fontSize = 38;
        popupText.setShadow(0, 2, 'rgba(0,0,0,0.75)', 1);
        popupText.alpha = 0;
        popupText.inputEnabled = true;
        popupText.events.onInputDown.add(this.hidePopup,this);
        popupText.inputEnabled = false;

        style = { fill: "#FF0000", align: "center" };
        bonusText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "", style);
        bonusText.anchor.setTo(0.5);
        bonusText.angle = 5;
        bonusText.font = 'Alfa Slab One';
        bonusText.fontSize = 45;
        bonusText.setShadow(0, 2, 'rgba(0,0,0,0.75)', 1);
        bonusText.alpha = 0;
        
        popupTextTween = this.game.add.tween(popupText).to( { alpha: 1}, 500, Phaser.Easing.Linear.In, false);
        hidePopupTextTween = this.game.add.tween(popupText).to( { alpha: 0 }, 260, Phaser.Easing.Linear.In, false);
        popupTextTween.onComplete.add(this.resetReady, this);

        console.log("Playstate created")

    },


    update: function() {

    },

    loseLife: function(){
        this.shakeWorld(10,20);
        numLives--;
        impactSound.play();
        if(numLives == 0){
            
            this.gameOver();
            //console.log("GAME OVER")
        }

    },

    gameOver: function(){
        blockParent.forEach(function(item){
            
            item.killBlockFill();
        })

        if(GameScoreTotal == 0){bonusPopupText.text = "0%"}
        var finalScore = parseFloat(currentAVGpercent/GameScoreTotal).toFixed(2);
        var totalScore = (GameScoreTotal > 0)?parseFloat(GameScoreTotal * finalScore + BonusScoreTotal).toFixed(2) : "0 POINTS";
        popupText.text = "FINAL SCORE:\n"+GameScoreTotal+" FILLS @ "  + bonusPopupText.text+ "\n" + totalScore + "\nPLAY AGAIN?";
        this.game.time.events.add(500, function(){
            overlay.alpha = 1;
            popupTextTween.start();
        });
        
        
    },

    resetReady: function(){
        popupText.inputEnabled = true;

    },

    hidePopup: function(){
        console.log("fired restart button");
        popupText.inputEnabled = false;
        nextThreshold = 10;
        GameScoreTotal = 0;
        currentAVGpercent = 0;
        BonusScoreTotal = 0;
        displayText.text = bonusPopupText.text = "";
        numLives = 1
        overlay.alpha = 0;
        hidePopupTextTween.start();
        this.game.add.tween(this.powerBar.scale).to( {x: 0 }, 500, Phaser.Easing.Linear.Out, true);
        blockParent.forEach(function(item){
            item.resetBlockFill();
        })

        
    },

    addPoints: function(inPercentage){
        console.log("tapped a block @: " + inPercentage);
        tapSound.play();
        GameScoreTotal ++;
        this.checkGameLevel(GameScoreTotal);
        displayText.text = GameScoreTotal;
        currentAVGpercent += inPercentage;
        var twoPlacedFloat = parseFloat(currentAVGpercent / GameScoreTotal).toFixed(2);
        this.game.add.tween(this.powerBar.scale).to( {x: twoPlacedFloat / 100 }, 150, Phaser.Easing.Linear.Out, true);
        //this.powerBar.scale.x = (currentAVGpercent/GameScoreTotal) / 100;
        bonusPopupText.text = twoPlacedFloat + "%";
        //currentAVGpercent = twoPlacedFloat;

        if(inPercentage > 90){
            this.comboMultiplier++;
            this.addComboBonus(inPercentage);
        }else{
            this.comboMultiplier = 0;
        }
    },

    addComboBonus: function(inPercentage){
        var bonus = this.comboMultiplier * inPercentage * 10;
        BonusScoreTotal += bonus;
        //console.log("bonus amount is : "+bonus)
        this.shakeWorld(5,20);
        bonusText.text = "COMBO BONUS\n" + bonus;
        bonusText.scale.setTo(0)
        this.game.add.tween(bonusText.scale).to( {x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
        this.game.add.tween(bonusText).to( {alpha: 1 }, 150, Phaser.Easing.Linear.Out, true);
        this.game.add.tween(bonusText).to( {alpha: 0 }, 150, Phaser.Easing.Linear.Out, true, 1200);

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
            levelUpSound.play();
        }
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
                //console.log("finished repetitions of shake world count")       
                this.game.world.setBounds(0, 0, this.game.width, this.game.height);     
            }

        }, this);

        if (navigator.vibrate) {
            navigator.vibrate(750)
        }
    }

};
