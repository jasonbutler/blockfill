FillBlock = function (game, x, y){
	
	Phaser.Sprite.call(this, game, x, y);
	//this.game = game;

	this.anchor.setTo(0.5);
    this.fillAmount = 0;
    this.pitchAmount = 0;	
    this.fillRate = this.game.rnd.integerInRange(5000, 15000);
    this.fillTimer = 0;
    this.filling = true;
    this.fillThreshold = .3;
    this.active = false;
    this.maxSpeed = 20000;
    this.overFilled = false;
    this.missSound = this.game.add.audio('miss');
    this.activeSound = this.game.add.audio('activeSound');

    this.threshRect = this.game.add.sprite(0, 0 , "blockSprite")
    this.threshRect.anchor.setTo(0.5,1)
    this.threshRect.alpha = 0.5;
    this.threshRect.scale.y = 0;
    this.addChild(this.threshRect)
    this.game.add.tween(this.threshRect.scale).to({y:this.fillThreshold},1500,Phaser.Easing.Elastic.Out,true);

    

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

    this.face = this.game.add.sprite(0, -40 , "half-smile")
    this.face.anchor.setTo(0.5)
    this.addChild(this.face)

    this.omvLogo = this.game.add.sprite(0, -150, 'preloadLogo');
    this.omvLogo.anchor.setTo(0.5);
    this.omvLogo.scale.setTo(0.25);
    this.omvLogo.alpha = 0.5;
    this.addChild(this.omvLogo)


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
    if(this.fillAmount < this.fillThreshold){
        this.updateThreshold();
        return;

    }

    if(!this.filling)
        return;
        

    this.filling = false;
    this.fillTween.stop();
    this.fillTween.pendingDelete = false;
    this.face.loadTexture("cheer")

    var twoPlacedFloat = parseFloat(this.fillAmount * 100).toFixed(2);
    var percInt = Math.round(this.fillAmount * 100);
    if(percInt>=99){
        this.fillThreshold = 0.3;
        this.game.add.tween(this.threshRect.scale).to({y:this.fillThreshold},750,Phaser.Easing.Elastic.Out,true);
        this.face.loadTexture("bliss");
    }
    this.stopSignal.dispatch(percInt, this.fillThreshold, this.pitchAmount);
    this.resetTween.start();
};

FillBlock.prototype.overfilled = function(){
    this.fillTween.stop();
    this.fillRect.scale.y = 1;
    this.inputEnabled = false;
    this.fillRect.tint = 0xFF0000;
    this.fillRect.alpha = .75;
    this.overFilled = true;
    this.face.loadTexture("no-smile")

    console.log("overfilled!!!! " + this.fillRect.tint)

    this.fullSignal.dispatch();
    this.emitter.start(true, 800, null, 20);


};

FillBlock.prototype.checkFillAmount = function(){

    if(this.fillAmount > this.fillThreshold){
        if(!this.active){
            this.active = true;
            this.fillRect.tint = 0x01DF01;
            this.face.loadTexture("smile")
            this.activeSound.play();
        }
        
    }
};

FillBlock.prototype.updateThreshold = function(){

    if(this.fillThreshold < .9){
        this.missSound.play();
        this.fillThreshold += .05;
    };

    if(this.fillThreshold > .9 && this.fillThreshold < .95){
        this.fillThreshold += .01;
    };

    if(this.maxSpeed > 9000){
        this.maxSpeed -= 750;
    };

    this.game.add.tween(this.threshRect.scale).to({y:this.fillThreshold},750,Phaser.Easing.Elastic.Out,true);

    this.face.loadTexture("bliss");    

    this.scale.setTo(1.2)
    var blissTween = this.game.add.tween(this.scale).to({x:1,y:1},750,Phaser.Easing.Elastic.Out,true);
    blissTween.onComplete.add(this.resetSmile,this)
        
};

FillBlock.prototype.resetSmile = function(){
    if(this.fillAmount < this.fillThreshold){
        this.face.loadTexture("half-smile");
    }else{
        this.face.loadTexture("smile");
    }
};

FillBlock.prototype.restartFill = function(){

    this.fillAmount = this.fillRect.scale.y = 0;
    this.fillRect.tint = 0xFFFFFF;
    this.fillRate = this.game.rnd.integerInRange(7500, this.maxSpeed);
    this.filling = true;
    this.face.loadTexture("half-smile")
    this.active = false;

    this.fillTween.start()

    //console.log("restart the fill tween")
};

FillBlock.prototype.resetFill = function(){

    this.fillRect.tint = 0xFFFFFF;
    this.resetTween.start()
};

FillBlock.prototype.resetBlockStatus = function(){
    
    this.fillTween = this.game.add.tween(this.fillRect.scale).to({y:1.1},this.fillRate,Phaser.Easing.Quadratic.Out,true,1000);
    this.resetTween = this.game.add.tween(this.fillRect.scale).to({y:0},250,Phaser.Easing.Quadratic.Out);
    this.resetTween.onComplete.add(this.restartFill, this);
    this.inputEnabled = true;
    this.fillThreshold = .3;
    this.fillRect.alpha = 1;
    this.maxSpeed = 20000;
    this.game.add.tween(this.threshRect.scale).to({y:this.fillThreshold},1000,Phaser.Easing.Quadratic.Out,true);
    this.restartFill();

};

FillBlock.prototype.killBlockFill = function(){
    this.inputEnabled = false;
    if(this.fillTween.isRunning){
        this.fillTween.pause()
    }
    
    if(this.resetTween.isRunning){
        this.resetTween.pause()
    }

    this.fillTween.stop()
    this.resetTween.stop()
    
};

FillBlock.prototype.resetBlockFill = function(){
    this.resetTween.start();
    this.game.time.events.add(1500,this.resetBlockStatus, this)
};




FillBlock.prototype.initSprite = function(){
        //this.alpha = 0;
        //this.scale.setTo(0.5);

        //var randomValue = this.game.rnd.integerInRange(1, 6); 

        var blobs = this.game.add.graphics(0, 0);
        blobs.beginFill(0xFFFFFF, 1);
        blobs.drawCircle(-50, -200, 12);
        blobs.drawCircle(50, -200, 12);
        this.addChild(blobs)

        var feet = this.game.add.graphics(0, 0);
        feet.beginFill(0xFFFFFF, 1);
        feet.drawCircle(-40, 0, 20);
        feet.drawCircle(40, 0, 20);
        this.addChild(feet)

        

        var footMask = this.game.add.graphics( 0, 0 );
        footMask.beginFill(0xFFFFFF, 0.1);
        footMask.drawRect(-50, 1, 100, 20);        
        this.addChild(footMask)  

        feet.mask = footMask; 
        
        var bgRect = this.game.add.graphics( 0, 0 );
        bgRect.lineStyle(4,0xFFFFFF,1)
        bgRect.beginFill(0xFFFFFF, 0.1);

        bgRect.drawRect(-50, -200, 100, 200);
        
        this.addChild(bgRect)   
    
        console.log("init complete");

        //var graphics = this.game.add.graphics(0, 0);
    
        // graphics.beginFill(0xFFFFFF);
        // //  Note the 'true' at the end, this tells it to draw anticlockwise
        // graphics.arc(10, -100, 10, this.game.math.degToRad(0), this.game.math.degToRad(180), false);
        // console.log("added arc")
        // graphics.endFill();


        // this.addChild(graphics)

};



