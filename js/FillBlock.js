FillBlock = function (game, x, y){
	
	Phaser.Sprite.call(this, game, x, y);
	//this.game = game;

	this.anchor.setTo(0.5);
    this.fillAmount = 0;	
    this.fillRate = this.game.rnd.integerInRange(5000, 15000);
    this.fillTimer = 0;
    this.filling = true;
    this.fillThreshold = .3;

    this.fillRect = this.game.add.sprite(0, 0 , "blockSprite")
    this.fillRect.anchor.setTo(0.5,1)
    this.fillRect.scale.y = this.fillAmount;
    this.addChild(this.fillRect)

    this.initSprite();

    this.inputEnabled = true;
    this.events.onInputDown.add(this.stopFill, this)
    this.fillTween = this.game.add.tween(this.fillRect.scale).to({y:1.1},this.fillRate,Phaser.Easing.Quadratic.Out,true,1000);
    this.resetTween = this.game.add.tween(this.fillRect.scale).to({y:0},250,Phaser.Easing.Quadratic.Out);
    this.resetTween.onComplete.add(this.restartFill, this);

    this.emitter = game.add.emitter(0, -200);
    this.emitter.makeParticles('particle');
    this.emitter.setXSpeed(-150, 150);
    this.emitter.setYSpeed(-150, 150);
    this.emitter.setScale(2, 0, 2, 0, 800);
    this.addChild(this.emitter)


    //add callbacks
    this.fullSignal = new Phaser.Signal();
    this.stopSignal = new Phaser.Signal();
	
};

FillBlock.prototype = Object.create(Phaser.Sprite.prototype);
FillBlock.prototype.constructor = FillBlock;

FillBlock.prototype.update = function(){
    if(this.filling){
        
        if(this.fillAmount > 1.01){
            this.filling = false;
            this.overfilled();
        }else{
            this.fillAmount = this.fillRect.scale.y;
            this.checkFillAmount();
        }
        // if(this.game.time.now > this.fillTimer){
        //     this.fillTimer = this.game.time.now + this.fillRate;
        //     //this.fillAmount += 0.025;
        //     //this.fillRect.scale.y = this.fillAmount;
        //     this.checkFillAmount();
        //     console.log("increasing fill amount to: " + this.fillAmount)
        //     console.log("this.game.time.now: " + this.game.time.now)
        //     console.log("this.fillTimer: " + this.fillTimer)
        //     if(this.fillAmount > 1){
        //         this.filling = false;
        //         this.fillRect.tint = 0xFF0000;
        //         this.overfilled();
        //     }
        // }
    }

};

FillBlock.prototype.stopFill = function(){
    if(this.fillAmount < this.fillThreshold)
        return;

    this.filling = false;
    this.fillTween.stop();
    this.fillTween.pendingDelete = false;
    //sendsignal for score
    //console.log(this.fillAmount)
    var twoPlacedFloat = parseFloat(this.fillAmount * 100).toFixed(2);
    var percInt = Math.round(this.fillAmount * 100);
    this.stopSignal.dispatch(percInt);
    this.resetTween.start();
};

FillBlock.prototype.restartFill = function(){

    this.fillAmount = this.fillRect.scale.y = 0;
    this.fillRect.tint = 0xFFFFFF;
    this.fillRate = this.game.rnd.integerInRange(7500, 20000);
    this.filling = true;

    this.fillTween.start()

    //console.log("restart the fill tween")
};

FillBlock.prototype.overfilled = function(){
    this.fillTween.stop();
    this.inputEnabled = false;
    this.fillRect.tint = 0xFF0000;
    this.fillRect.alpha = .75;

    console.log("overfilled!!!! " + this.fillRect.tint)

    this.fullSignal.dispatch();
    this.emitter.start(true, 800, null, 20);


};

FillBlock.prototype.checkFillAmount = function(){

    if(this.fillAmount > this.fillThreshold){
        this.fillRect.tint = 0x01DF01;
    }
};

FillBlock.prototype.updateThreshold = function(){

    if(this.fillThreshold < .9){
        this.fillThreshold += .05;
    };

    this.scale.setTo(1.2)
    this.game.add.tween(this.scale).to({x:1,y:1},350,Phaser.Easing.Elastic.Out,true);
        
};

FillBlock.prototype.initSprite = function(){
        //this.alpha = 0;
        //this.scale.setTo(0.5);

        //var randomValue = this.game.rnd.integerInRange(1, 6); 
        
        var bgRect = this.game.add.graphics( 0, 0 );
        bgRect.lineStyle(4,0xFFFFFF,1)
        bgRect.beginFill(0xFFFFFF, 0.1);
        bgRect.drawRect(-50, -200, 100, 200);
        this.addChild(bgRect)        
        console.log("init complete");

};