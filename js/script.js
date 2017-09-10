/*TO DO LEVEL 1:
put creating info in JSON file
platforms
    -find better image
    -make variable lengths 
    -spacing on 2nd platform makes it really hard to win
obstacles
    -spikes/toxic sludge on ground
lives logic
    -3 lives- display next to score
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

EXTRAS:
-choose different player icon
-powerup?- move faster 10 seconds, jump higher 10 seconds
-laser blocking path 

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

var stars;
var score = 0;
var starPickupCount = 0;
var lives = 3; 
var scoreText;
var starCountText;


//GAMEPLAY MAIN STATE 

var mainState = {
    preload: function() {
        game.load.image('background', 'img/bg1.jpg');
        game.load.image('baseGround', 'img/ground.png');
        game.load.image('ground', 'img/platform2.png');
        game.load.image('invisibleWall', 'img/invisible_wall.png');
        game.load.image('star', 'img/star.png');
        game.load.image('alienIdleRight', 'img/alienIdleRight.png');
        game.load.spritesheet('alienSprite', 'img/alienSpritesheet.png', 90, 93);
        game.load.spritesheet('astronaut', 'img/astronaut.png', 75, 85);
        game.load.audio('jumpNoise', 'sound/jump.wav');
        game.load.audio('killNoise', 'sound/hit.wav');
        game.load.audio('starNoise', 'sound/star.wav');
        game.load.audio('deathNoise', 'sound/sadTrombone.wav');
    },
    create: function() {
        //background
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, 0, 'background');

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

        //make invisible walls to stop aliens
        //figure out a function to make this easier? 
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
        player = game.add.sprite(75, 85, 'astronaut');
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  movement
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

        //Idle aliens 
        alienIdle = game.add.group();
        alienIdle.enableBody = true;
        alienIdleRight = alienIdle.create(350, 500, 'alienIdleRight');

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

        // starter score
        scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });
        starCountText = game.add.text(42, 50, 'x 0', { fontSize: '22px', fill: '#ffffff' });
        this.game.add.image(16, 50, 'star');
        //controls
        cursors = game.input.keyboard.createCursorKeys();  
    },

    update: function() {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.collide(alienIdle, platforms);
        game.physics.arcade.collide(aliensThatMoveGroup, platforms);
        game.physics.arcade.collide(aliensThatMoveGroup, walls);


        game.physics.arcade.overlap(player, stars, this.collectStar, null, this);
        game.physics.arcade.overlap(player, alienIdle, this.killAlienIdle, null, this);
        game.physics.arcade.overlap(player, aliensThatMoveGroup, this.killAlienIdle, null, this);
        //Reset the players velocity so he doesn't slide around
        player.body.velocity.x = 0;
        //movements attached to keys
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
    collectStar: function(player, star) {
        star.kill();
        game.sound.play('starNoise');
        score += 10;
        starPickupCount++; 
        scoreText.text = 'Score: ' + score;
        starCountText.text = 'x '+ starPickupCount; 
    },

    killAlienIdle: function(player, alienIdleRight){
        if(alienIdleRight.body.touching.up ){      
            player.body.velocity.y = -200;  
            alienIdleRight.kill();         
            game.sound.play('killNoise');
            score +=15;
            scoreText.text = 'Score: ' + score;  
        }else{ 
            //WHY IS IT SLOWING DOWN THE SOUND TOO??
            game.sound.play('deathNoise');
            resetToStart();            
            lives -=1; 
            // game.time.events.add(Phaser.Timer.SECOND * 2, resetToStart, this).autoDestroy = true;
        }

    }
}

function resetToStart(){
    game.state.start('main');
}

//BEGINS GAME

var game = new Phaser.Game(800, 800);
game.state.add('main', mainState);  
game.state.start('main');



/*Resources: 
http://blog.kumansenu.com/2016/04/patrolling-enemy-ai-with-phaser/
https://hacks.mozilla.org/2017/04/html5-games-workshop-make-a-platformer-game-with-javascript/


*/