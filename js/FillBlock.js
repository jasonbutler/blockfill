FillBlock = function (game, x, y){
	
	Phaser.Sprite.call(this, game, x, y);
	//this.game = game;

	this.anchor.setTo(0.5);
    this.fillAmount = 0;	
    this.fillRate = this.game.rnd.integerInRange(5000, 15000);
    this.fillTimer = 0;
    this.filling = true;
    this.fillThreshold = .3;
    this.maxSpeed = 20000;

    this.threshRect = this.game.add.sprite(0, 0 , "blockSprite")
    this.threshRect.anchor.setTo(0.5,1)
    this.threshRect.alpha = 0.5;
    this.threshRect.scale.y = this.fillThreshold;
    this.addChild(this.threshRect)

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
    }

};

FillBlock.prototype.stopFill = function(){
    if(this.fillAmount < this.fillThreshold)
        return;

    this.filling = false;
    this.fillTween.stop();
    this.fillTween.pendingDelete = false;

    var twoPlacedFloat = parseFloat(this.fillAmount * 100).toFixed(2);
    var percInt = Math.round(this.fillAmount * 100);
    this.stopSignal.dispatch(percInt);
    this.resetTween.start();
};

FillBlock.prototype.restartFill = function(){

    this.fillAmount = this.fillRect.scale.y = 0;
    this.fillRect.tint = 0xFFFFFF;
    this.fillRate = this.game.rnd.integerInRange(7500, this.maxSpeed);
    this.filling = true;

    this.fillTween.start()

    //console.log("restart the fill tween")
};

FillBlock.prototype.resetFill = function(){

    this.fillRect.tint = 0xFFFFFF;
    this.resetTween.start()
};

FillBlock.prototype.resetBlockStatus = function(){
    this.fillTween = null;
    this.fillTween = this.game.add.tween(this.fillRect.scale).to({y:1.1},this.fillRate,Phaser.Easing.Quadratic.Out,true,1000);
    this.inputEnabled = true;
    this.fillThreshold = .3;
    this.threshRect.scale.y = this.fillThreshold;
    this.fillRect.alpha = 1;
    this.maxSpeed = 20000;
    this.restartFill();

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

    if(this.maxSpeed > 8000){
        this.maxSpeed -= 500;
    };

    this.game.add.tween(this.threshRect.scale).to({y:this.fillThreshold},750,Phaser.Easing.Elastic.Out,true);

    this.scale.setTo(1.2)
    this.game.add.tween(this.scale).to({x:1,y:1},750,Phaser.Easing.Elastic.Out,true);
        
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
