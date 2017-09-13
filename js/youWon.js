

var rocket;
var winnerText;
var playAgain;

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
        rocket.animations.add('flyToEarth');
        rocket.animations.play('flyToEarth', 15, true);
        winnerText = game.add.text(150, 200, 'You won!', { fontSize: '60px', fill: '#ffffff' });
         winnerText.font = 'Press Start 2P';
        winnerText.align = 'center';
        playAgain = game.add.text(150, 400, 'Play again?', { fontSize: '40px', fill: '#33FF33' });
        playAgain.font = 'Press Start 2P';
        playAgain.inputEnabled = true;
        playAgain.input.useHandCursor = true;
        playAgain.events.onInputDown.add(down, this);
        game.physics.arcade.enable([ winnerText, playAgain ]);
        winnerText.body.velocity.setTo(200, 200);
        winnerText.body.collideWorldBounds = true;
        winnerText.body.bounce.set(1);
     },

     update: function(){
        rocket.x +=2;
        rocket.y -=.7;
        if(rocket.x == 680){
            rocket.kill();
        }
     }
}

function down(){
    this.state.start('menu');

}