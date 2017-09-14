//GAMEPLAY START SCREEN

WebFontConfig = {
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
    google: {
      families: ['Press Start 2P']
    }
};
var filter;
var sprite;
var playerSelected; 

var menu = {
    preload: function(){
        game.load.image('startBackground', 'assets/bgStart.jpg');
        game.load.image('start', 'assets/start.png');
        game.load.image('robot', 'assets/robotIdle.png');
        game.load.image('astronaut', 'assets/astroIdle.png');
        game.load.image('box', 'assets/selectorBox.png');
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

        game.add.button(200, 600, 'astronaut', this.selectPlayerAstro, this);
        game.add.button(400, 600, 'robot', this.selectPlayerRobot, this);
     },
    startGame: function(){
        this.state.start('level1');
    },
    selectPlayerAstro: function(){
        if(playerSelected == undefined){
            playerSelected = 'astronaut'; 
            game.add.image(180, 580, 'box');
        }else if(playerSelected == 'robot'){
            
        }
    },
    selectPlayerRobot: function(){
        playerSelected = 'robot'; 
        game.add.image(380, 580, 'box');
    }
}


function createText(){
    instructions = game.add.text(50, 200, 'Control your player using arrow keys.\n Collect stars while avoiding\n aliens and obstacles.\n Press the spacebar to shoot.', { fontSize: '20px', fill: '#ffffff' });
    instructions.font = 'Press Start 2P';
    instructions.align = 'center';
}

