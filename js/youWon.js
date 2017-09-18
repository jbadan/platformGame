

var rocket;
var winnerText;
var playAgain;
var a = 1;

var win = {
    preload: function(){
        game.load.image('winBackground', 'assets/winbg.jpg');
        game.load.image('rocket', 'assets/playerShip1_orange.png');
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.camera.flash('#000000');
        game.add.sprite(0, 0, 'winBackground');
        rocket = game.add.sprite(0, 700, 'rocket');
        rocket.anchor.setTo(.5, .5);
        rocket.angle = 45;
        rocket.animations.add('flyToEarth');
        rocket.animations.play('flyToEarth', 15, true);
        game.time.events.add(Phaser.Timer.SECOND, makeText, this);
     },
     update: function(){
        rocket.x +=2;
        rocket.y -=.7;
        game.time.events.loop(Phaser.Timer.SECOND, scaleRocket, this);
        if(rocket.x == 780){
            rocket.kill();
        }
     }
}

function makeText(){
    winnerText = game.add.text(200, 200, 'You won!\nScore: '+score, { fontSize: '40px', fill: '#ffffff' });
    winnerText.font = 'Press Start 2P';
    winnerText.align = 'center';
    game.time.events.add(Phaser.Timer.SECOND * 5, removeWinnerText, this);

    playAgain = game.add.text(150, 400, 'Play again?', { fontSize: '40px', fill: '#33FF33' });
    playAgain.font = 'Press Start 2P';
    playAgain.inputEnabled = true;
    playAgain.input.useHandCursor = true;
    playAgain.events.onInputDown.add(goToMenu, this);

    addTween(playAgain);
    addTween(winnerText);
}

function scaleRocket(){
    a -= .001; 
    rocket.scale.setTo(a ,a);
    if(a <= 0){
        rocket.scale.setTo(.1, .1);
    }
}

function removeWinnerText(){
    winnerText.setText("");
}

function addTween(item){
    var tween = game.add.tween(item);
    tween.to({y:item.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut);
    tween.yoyo(true);
    tween.loop();
    tween.start();
}

function goToMenu(){
    hasKey = false;
    score = 0;
    starPickupCount = 0;
    lives = 3;
    this.state.start('menu');
}