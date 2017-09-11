/*TO DO LEVEL 1:
put creating info in JSON file
platforms
    -find better image
    -make variable lengths 
    -spacing on 2nd platform makes it really hard to win
lives
    -change counter to images
high score
    -display above current score
    -store in local storage
enemies:
    shoot
    different types
astronaut:
    add gun  
        -update spritesheet to include shooting
        -shooting logic
    add jumping/stopped/falling spritesheet
    -https://mozdevs.github.io/html5-games-workshop/en/guides/platformer/animations-for-the-main-character/

sound:
    collect key
    rocket take off
    background music?
    add music/sound mute toggle

EXTRAS:
-choose different player icon
-powerup?- move faster 10 seconds, jump higher 10 seconds

CURRENT BUGS:
-death animation
-time delay for restart after death sound

*/

//EXTERNAL SPRITES

//alien sprites 
function AlienMoving(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'alienSprite');
    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('patrolRight', [12,13,14,15,16,17,18,19,20,21,22,23], 8, true);
    this.animations.add('patrolLeft', [0,1,2,3,4,5,6,7,8,9,10,11], 8, true); 
    this.animations.add('die', [24,25], .1);
    this.animations.play('patrolRight');

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = AlienMoving.SPEED;
}
AlienMoving.SPEED = 100;

AlienMoving.prototype = Object.create(Phaser.Sprite.prototype);
AlienMoving.prototype.constructor = AlienMoving;

AlienMoving.prototype.update = function(){
    if (this.body.touching.right || this.body.blocked.right) {
        // turn left
        this.body.velocity.x = -AlienMoving.SPEED; 
        this.animations.play('patrolLeft');
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = AlienMoving.SPEED; 
        // turn right
        this.animations.play('patrolRight');
    }
};

//THIS IS NOT WORKING - or maybe the animation is just too fast? idk
AlienMoving.prototype.die = function () {
    this.body.enable = false;
    this.animations.play('die').onComplete.addOnce(function () {
        this.killAlienIdle();
    }, this);
};



var player;
var platforms;
var cursors;
var spikesGroup; 
var lasers; 
var laserBeam; 

var stars;

var key; 
var rocket;
var button; 

var score = 0;
var starPickupCount = 0;
var livesText; 
var lives = 3; 
var scoreText;
var starCountText;
var hasKey = false; 


//GAMEPLAY MAIN STATE 

var mainState = {
    preload: function() {
        game.load.image('background', 'img/bg1.jpg');
        game.load.image('baseGround', 'img/ground.png');
        game.load.image('ground', 'img/platform2.png');
        game.load.image('invisibleWall', 'img/invisible_wall.png');
        game.load.image('star', 'img/star.png');
        game.load.image('alienIdleRight', 'img/alienIdleRight.png');
        game.load.image('rocket', 'img/playerShip1_orange.png');
        game.load.image('key', 'img/hud_keyBlue.png');
        game.load.image('keyDisabled', 'img/hud_keyBlue_disabled.png');
        game.load.image('spikes', 'img/spikes.png');
        game.load.image('heartFull', 'img/hud_heartFull.png');
        game.load.image('heartEmpty', 'img/hud_heartEmpty.png');
        game.load.image('buttonPressed', 'img/buttonRed_pressed_50.png');
        game.load.image('button', 'img/buttonRed_50.png');
        game.load.image('laser', 'img/laserRight_50.png');
        game.load.image('laserBeam', 'img/laserRedHorizontal.png');

        game.load.spritesheet('alienSprite', 'img/alienSpritesheet.png', 90, 93);
        game.load.spritesheet('astronaut', 'img/astronaut.png', 75, 85);
        
        game.load.audio('jumpNoise', 'sound/jump.wav');
        game.load.audio('killNoise', 'sound/hit.wav');
        game.load.audio('starNoise', 'sound/star.wav');
        game.load.audio('deathNoise', 'sound/sadTrombone.wav');
    },
    create: function() {
        this.camera.flash('#000000');
        //background
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, 0, 'background');
        //platform  group
        platforms = game.add.group();
        platforms.enableBody = true;
        
        //ground
        var ground = platforms.create(0, game.world.height - 40, 'ground');
        ground.scale.setTo(4, 2);
        ground.body.immovable = true;

        // platform ledges
        var ledge = platforms.create(200, 600, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(400, 475, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(600, 350, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(200, 275, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(-150, 150, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(500, 150, 'ground');
        ledge.body.immovable = true;

        //spikes
        spikesGroup = game.add.group();
        spikesGroup.enableBody = true;
        spikesGroup.allowGravity = false; 

        var spike = spikesGroup.create(600, 317, 'spikes');
        spike.body.immovable = true;
        spike = spikesGroup.create(300, 727, 'spikes');
        spike.body.immovable = true;
        spike = spikesGroup.create(330, 727, 'spikes');
        spike.body.immovable = true;
        
        //button to turn off laser 
        var buttons = game.add.group();
        buttons.enableBody = true;
        game.physics.enable(buttons);
        button = buttons.create(700, 314, 'button');

        //laser box
        lasers = game.add.group();
        lasers.enableBody = true;
        lasers.allowGravity = false;
        game.physics.enable(lasers);
        laser = lasers.create(390, 565, 'laser');
        laser.body.immovable = true;

        //laser beam
        laserBeam = lasers.create(426, 546, 'laserBeam');
        laserBeam.body.immovable = true;
        laserBeam.scale.setTo(6 ,1);
        var tween = game.add.tween(laserBeam);
        tween.to({y:laserBeam.y + 2}, 800, Phaser.Easing.Sinusoidal.InOut);
        tween.yoyo(true);
        tween.loop();
        tween.start();

        //make invisible walls to stop aliens
        walls = game.add.group();
        walls.enableBody = true;
        walls.allowGravity = false; 
        walls.visible = false;
        var wall = walls.create(374, 433, 'invisibleWall');
        wall.body.immovable = true;
        wall = walls.create(630, 433, 'invisibleWall');
        wall.body.immovable = true;
        wall = walls.create(564, 310, 'invisibleWall');
        wall.body.immovable = true;
        wall = walls.create(808, 310, 'invisibleWall');
        wall.body.immovable = true;
        wall = walls.create(170, 230, 'invisibleWall');
        wall.body.immovable = true;
        wall = walls.create(430, 230, 'invisibleWall');
        wall.body.immovable = true;

        // make astronaut
        player = game.add.sprite(25, 650, 'astronaut');
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        player.animations.add('left', [1, 3, 5, 7, 9, 11, 13], 10, true);
        player.animations.add('right', [0, 2, 4, 6, 8, 10, 12], 10, true);

        // stars!
        stars = game.add.group();
        stars.enableBody = true;
        star = stars.create(350, 575, 'star');
        star = stars.create(480, 450, 'star');
        star = stars.create(650, 325, 'star');
        star = stars.create(200, 250, 'star');
        star = stars.create(20, 125, 'star');
        star = stars.create(650, 125, 'star');

        //moving aliens (extended sprite);
        aliensThatMoveGroup = game.add.group();
        aliensThatMoveGroup.enableBody = true;
        var alienThatMoves = new AlienMoving(this.game, 400, 435, 'alienSprite', 0);  
        this.game.add.existing(alienThatMoves);
        aliensThatMoveGroup.add(alienThatMoves);
        alienThatMoves = new AlienMoving(this.game, 600, 310, 'alienSprite', 0);  
        this.game.add.existing(alienThatMoves);
        aliensThatMoveGroup.add(alienThatMoves);
         alienThatMoves = new AlienMoving(this.game, 200, 235, 'alienSprite', 0);  
        this.game.add.existing(alienThatMoves);
        aliensThatMoveGroup.add(alienThatMoves);

        // starter score/hearts/stars
        scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });
        starCountText = game.add.text(42, 50, 'x 0', { fontSize: '22px', fill: '#ffffff' });
        this.game.add.image(16, 50, 'star');
        this.game.add.image(16, 80, 'keyDisabled');

        livesText = game.add.text(670, 16, 'Lives: 3', { fontSize: '32px', fill: '#ffffff' });

        //controls
        cursors = game.input.keyboard.createCursorKeys();  
    },

    update: function() {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.collide(aliensThatMoveGroup, platforms);
        game.physics.arcade.collide(aliensThatMoveGroup, walls);
        game.physics.arcade.collide(spikesGroup, platforms);
        game.physics.arcade.collide(player, lasers, this.laserDeath, null, this);
        game.physics.arcade.collide(player, spikesGroup, this.spikeOverlap, null, this);
        game.physics.arcade.collide(player, button, this.toggleButton, null, this);


        game.physics.arcade.overlap(player, stars, this.collectStar, null, this);
        game.physics.arcade.overlap(player, aliensThatMoveGroup, this.killAlien, null, this);
        game.physics.arcade.overlap(player, key, this.collectKey, null, this);
        game.physics.arcade.overlap(player, rocket, this.rocketLaunch, function(player, rocket){
            return this.hasKey && player.body.touching.down;
        }, this);
        //Reset the players velocity so he doesn't slide around
        player.body.velocity.x = 0;

        //astronaut movements attached to keys
        if (cursors.left.isDown){
            player.body.velocity.x = -150;
            player.animations.play('left');
        }else if (cursors.right.isDown){
           player.body.velocity.x = 150;
            player.animations.play('right');
        }else{
            player.animations.stop();
            player.frame = 4;
        }
        if (cursors.up.isDown && player.body.touching.down){
            player.body.velocity.y = -350;
            game.sound.play('jumpNoise');
        }

    },

    toggleButton: function(player, button){
      if(button.body.touching.up){
        button.kill();
        laser.kill();
        laserBeam.kill();
        this.game.add.image(700, 314, 'buttonPressed');
      }  
    },

    spikeOverlap: function(player, spike){
        if(spike.body.touching.up){
        loseLife();
        }
    },

    laserDeath: function(player, laserBeam){
        if(laserBeam.body.touching.up){
        loseLife();
        }
    },

    collectStar: function(player, star) {
        star.kill();
        game.sound.play('starNoise');
        score += 10;
        starPickupCount++; 
        scoreText.text = 'Score: ' + score;
        starCountText.text = 'x '+ starPickupCount; 
        if(starPickupCount>=6){
            //add key if all stars are collected
            var keys = game.add.group();
            keys.enableBody = true;
            game.physics.enable(keys);
            key = keys.create(600, 720, 'key');
            key.anchor.setTo(0.5, 1);
        }
    },

    collectKey: function(player, key){
        key.kill();
        hasKey = true; 
        this.game.add.image(16, 80, 'key');
        //add rocket
        var bgDecoration = game.add.group();
        rocket = bgDecoration.create(290, 275, 'rocket');
        rocket.anchor.setTo(0.5, 1);
        game.physics.enable(rocket);
        rocket.body.allowGravity = false;
    },

    killAlien: function(player, alien){
        if(alien.body.touching.up ){      
            player.body.velocity.y = -200;  
            alien.kill();         
            game.sound.play('killNoise');
            score +=15;
            scoreText.text = 'Score: ' + score;  
        }else{ 
            //WHY IS IT SLOWING DOWN THE SOUND TOO??
            game.sound.play('deathNoise');           
            loseLife();
        }
    },
    rocketLaunch: function(player, rocket){
        rocket.body.velocity.y = -500;
        player.kill();
    }
}

function loseLife(){
    lives -=1;
    livesText.text = 'Lives: '+lives;
     if(lives == 0){
        resetToStart();
    }else{
        resetPlayer();
    }
}

function resetPlayer(){
    player.kill();
    player.reset(25, 650);
}

function resetToStart(){
    game.camera.fade('#000000');
    game.camera.onFadeComplete.add(this.fadeComplete,this);
    hasKey = false;
    score = 0;
    starPickupCount = 0;
    game.add.image(16, 80, 'keyDisabled');
    lives = 3;

}

function fadeComplete(){
    game.state.start('main');
}

//BEGINS GAME

var game = new Phaser.Game(800, 800);
game.state.add('main', mainState);  
game.state.start('main');



/*Resources: 
http://blog.kumansenu.com/2016/04/patrolling-enemy-ai-with-phaser/
https://hacks.mozilla.org/2017/04/html5-games-workshop-make-a-platformer-game-with-javascript/
http://kenney.nl/

*/