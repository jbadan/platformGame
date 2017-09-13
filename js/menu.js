//GAMEPLAY START SCREEN

WebFontConfig = {
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
    google: {
      families: ['Press Start 2P']
    }
};
var filter;
var sprite;

var menu = {
    preload: function(){
        game.load.image('startBackground', 'img/bgStart.jpg');
        game.load.image('start', 'img/start.png');
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        var instructions = null;

    },
    create: function(){
        this.camera.flash('#000000');
        game.add.sprite(0, 0, 'startBackground');
        createText();
        // //start button
        var start = this.add.button(180, 350, 'start', this.startGame, this);
        var tween = game.add.tween(start);
        tween.to({y:start.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut);
        tween.yoyo(true);
        tween.loop();
        tween.start();
        start.inputEnabled = true;
        start.input.useHandCursor = true;
     },
    startGame: function(){
        this.state.start('level1');
    }
}


function createText(){
    instructions = game.add.text(50, 200, 'Move the astronaut using arrow keys.\n Collect stars while avoiding\n aliens and obstacles.\n Press the spacebar to shoot.', { fontSize: '20px', fill: '#ffffff' });
    instructions.font = 'Press Start 2P';
    instructions.align = 'center';
}
