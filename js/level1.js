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


///GLOBAL VARIABLES

var player;
var platforms;
var cursors;
var spikesGroup; 
var lasers; 
var laserBeam; 
var weapon;
var fireButton;
var bullet;

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
var highScoreText;
var hasKey = false; 
localStorage.highScore;
if(localStorage.highScore === undefined){
  localStorage.highScore = 0;
}


//GAMEPLAY MAIN STATE 
var level1 = {
    preload: function() {
        game.load.image('background', 'assets/bg1.jpg');
        game.load.image('mountains', 'assets/mountains.png');
        game.load.image('planet', 'assets/planet.png');
        game.load.image('baseGround', 'assets/ground.png');
        game.load.image('fence', 'assets/metalFence.png');
        game.load.image('fenceRight', 'assets/metalFenceRight.png');
        game.load.image('leftBeam', 'assets/beamDiagonalLeft.png');
        game.load.image('rightBeam', 'assets/beamDiagonalRight.png');
        game.load.image('narrowBeam', 'assets/beamNarrow.png');
        game.load.image('ground', 'assets/platform3.png');
        game.load.image('invisibleWall', 'assets/invisible_wall.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('alienIdleRight', 'assets/alienIdleRight.png');
        game.load.image('rocket', 'assets/playerShip1_orange.png');
        game.load.image('key', 'assets/hud_keyRed.png');
        game.load.image('keyDisabled', 'assets/hud_keyRed_disabled.png');
        game.load.image('spikes', 'assets/spikes.png');
        game.load.image('heartFull', 'assets/hud_heartFull.png');
        game.load.image('heartEmpty', 'assets/hud_heartEmpty.png');
        game.load.image('buttonPressed', 'assets/buttonRed_pressed_50.png');
        game.load.image('button', 'assets/buttonRed_50.png');
        game.load.image('laser', 'assets/laserRight_50.png');
        game.load.image('laserBeam', 'assets/laserRedHorizontal.png');
        game.load.image('bullet', 'assets/laserPurple.png');

        game.load.spritesheet('alienSprite', 'assets/alienSpritesheet.png', 90, 93);
        game.load.spritesheet('robotSprite', 'assets/spritesheet_80.png', 168, 161);
        game.load.spritesheet('astronaut', 'assets/astroSpritesheet.png', 83, 86);
        
        game.load.audio('jumpNoise', 'assets/sound/jump.wav');
        game.load.audio('killNoise', 'assets/sound/hit.wav');
        game.load.audio('starNoise', 'assets/sound/star.wav');
        game.load.audio('deathNoise', 'assets/sound/sadTrombone.wav');
    },
    create: function() {
        this.camera.flash('#000000');
        //background
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, 0, 'background');
        game.add.sprite(-200, 500, 'mountains');
        game.add.sprite(470, 50, 'planet');
        game.add.sprite(0, 690, 'fence');
        game.add.sprite(60, 690, 'fenceRight');
        game.add.sprite(730, 370, 'leftBeam');
        game.add.sprite(-10, 172, 'rightBeam');
        game.add.sprite(203, 270, 'narrowBeam');
        game.add.sprite(273, 270, 'narrowBeam');
        game.add.sprite(343, 270, 'narrowBeam');

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
        spike = spikesGroup.create(270, 727, 'spikes');
        spike.body.immovable = true;
        spike = spikesGroup.create(300, 727, 'spikes');
        spike.body.immovable = true;
        spike = spikesGroup.create(330, 727, 'spikes');
        spike.body.immovable = true;
        spike = spikesGroup.create(360, 727, 'spikes');
        spike.body.immovable = true;
        
        //button to turn off laser 
        var buttons = game.add.group();
        buttons.enableBody = true;
        game.physics.enable(buttons);
        button = buttons.create(700, 320, 'button');

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

        //astronaut weapon
        weapon = game.add.weapon(30, 'bullet');
        weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        weapon.bulletLifespan = 2000;
        weapon.bulletSpeed = 600;
        weapon.fireRate = 1000;

        // make astronaut
        player = game.add.sprite(25, 650, 'astronaut');
        game.physics.arcade.enable(player);
        player.anchor.set(0.5);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        player.animations.add('left', [1, 7, 13, 19, 25, 31, 37], 10, true);
        player.animations.add('right', [0, 6, 12, 18, 24, 30, 36], 10, true);
        player.animations.add('shootRight', [2, 8, 14, 20, 26, 32, 38], 5, true);
        player.animations.add('shootLeft', [3, 9, 15, 21, 27, 33, 39], 5, true);

        weapon.trackSprite(player, 0, 0, false);
        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        // stars!
        stars = game.add.group();
        stars.enableBody = true;
        star = stars.create(350, 575, 'star');
        star = stars.create(480, 450, 'star');
        star = stars.create(650, 325, 'star');
        star = stars.create(200, 250, 'star');
        star = stars.create(20, 125, 'star');
        star = stars.create(650, 125, 'star');
        var tweenStar = game.add.tween(stars);
        tweenStar.to({y:stars.y + 3}, 600, Phaser.Easing.Sinusoidal.InOut);
        tweenStar.yoyo(true);
        tweenStar.loop();
        tweenStar.start();

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

        // HUD display
        this.game.add.image(16, 45, 'star');
        this.game.add.image(16, 75, 'keyDisabled');

        scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '22px', fill: '#ffffff' });
        starCountText = game.add.text(42, 45, 'x 0', { fontSize: '22px', fill: '#ffffff' });
        livesText = game.add.text(660, 40, 'Lives: 3', { fontSize: '20px', fill: '#ffffff' });
        highScoreText = game.add.text(660, 16, 'High score: '+localStorage.highScore, { fontSize: '20px', fill: '#ffffff' });
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
        game.physics.arcade.overlap(weapon.bullets, aliensThatMoveGroup, this.killAlienBullet, null, this);
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
            player.frame = 0;
        }
        if (cursors.up.isDown && player.body.touching.down){
            player.body.velocity.y = -350;
            game.sound.play('jumpNoise');
        }
        if (fireButton.isDown){
            if (cursors.left.isDown) {
                weapon.fireAngle = Phaser.ANGLE_LEFT;
                player.animations.play('shootLeft');
                weapon.fire();
            } else if (cursors.right.isDown) {
                weapon.fireAngle = Phaser.ANGLE_RIGHT;
                player.animations.play('shootRight');
                weapon.fire();
            }else{
                weapon.fireAngle = Phaser.ANGLE_RIGHT;
                player.animations.play('shootRight');
                weapon.fire();
            }
        }
    },

    toggleButton: function(player, button){
      if(button.body.touching.up){
        button.kill();
        laser.kill();
        laserBeam.kill();
        this.game.add.image(700, 320, 'buttonPressed');
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
        increaseScore();
        game.sound.play('starNoise');
        starPickupCount++; 
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
        if(alien.body.touching.up){      
            player.body.velocity.y = -200;  
            alien.kill();         
            game.sound.play('killNoise');
            increaseScore();
        }else{ 
            game.sound.play('deathNoise');           
            loseLife();
        }
    },
    killAlienBullet: function(bullet, alien){
        alien.kill(); 
        bullet.kill();     
        game.sound.play('killNoise');
        increaseScore(); 
    },
    rocketLaunch: function(player, rocket){
        rocket.body.velocity.y = -500;
        player.kill();
        game.time.events.add(Phaser.Timer.SECOND * 3, goToWinScreen, this);
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

function increaseScore(){
    score += 10;
    scoreText.text = 'Score: ' + score;
    if(score > localStorage.highScore){
        localStorage.highScore = score;
        highScoreText = "High score: "+ localStorage.highScore;
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
    game.state.start('end');
}

function goToWinScreen(){
    game.state.start('win');
}