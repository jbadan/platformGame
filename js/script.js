var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('background', 'img/bg1.jpg');
    game.load.image('baseGround', 'img/ground.png');
    game.load.image('ground', 'img/platform2.png');
    game.load.image('star', 'img/star.png');
    game.load.spritesheet('astronaut', 'img/astronaut.png', 75, 85);

}

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

function create() {
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

    //aliens!

    // starter score
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });
    //controls
    cursors = game.input.keyboard.createCursorKeys();  
}

function update() {
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    //if player overlaps w/ star- collectStar();
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
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
    }
}

function collectStar (player, star) {
    star.kill();
    // update score
    score += 10;
    scoreText.text = 'Score: ' + score;
}