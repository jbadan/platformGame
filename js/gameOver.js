//GAMEPLAY END SCREEN 

WebFontConfig = {
    google: {
      families: ['Press Start 2P']
    }
};


var end = {
    preload: function(){
        game.load.image('endBackground', 'assets/bgEnd.jpg');
        game.load.image('retry', 'assets/retry_logo.png');
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        var endText = null;

    },
    create: function(){
        this.camera.flash('#000000');
        game.add.sprite(0, 0, 'endBackground');
        
        endText = game.add.text(50, 200, 'Game Over!', { fontSize: '70px', fill: '#ffffff' });
        endText.font = 'Press Start 2P';
        endText.align = 'center';   
        addTween(endText);

        var retry = this.add.button(180, 350, 'retry', this.RestartGame, this);
        addTween(retry);
        retry.inputEnabled = true;
        retry.input.useHandCursor = true;
    },
    update: function(){},
    RestartGame: function(){
        hasKey = false;
        score = 0;
        starPickupCount = 0;
        game.add.image(16, 80, 'keyDisabled');
        lives = 3;
        this.state.start('level1');
    }
}

function addTween(item){
    var tween = game.add.tween(item);
    tween.to({y:item.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut);
    tween.yoyo(true);
    tween.loop();
    tween.start();
}