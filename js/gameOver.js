//GAMEPLAY END SCREEN 

WebFontConfig = {
    google: {
      families: ['Press Start 2P']
    }
};


var end = {
    preload: function(){
        game.load.image('endBackground', 'img/bgEnd.jpg');
        game.load.image('retry', 'img/retry_logo.png');
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        var endText = null;

    },
    create: function(){
        this.camera.flash('#000000');
        game.add.sprite(0, 0, 'endBackground');
        createTextEnd();
        var retry = this.add.button(180, 350, 'retry', this.RestartGame, this);
        var tween = game.add.tween(retry);
        tween.to({y:retry.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut);
        tween.yoyo(true);
        tween.loop();
        tween.start();
        retry.inputEnabled = true;
        retry.input.useHandCursor = true;
        retry.events.onInputDown.add(listenerStart);
    },
    update: function(){},
    RestartGame: function(){
        this.state.start('level1');
    }
}

function createTextEnd(){
    endText = game.add.text(50, 200, 'Game Over!', { fontSize: '70px', fill: '#ffffff' });
    endText.font = 'Press Start 2P';
    endText.align = 'center';  
}