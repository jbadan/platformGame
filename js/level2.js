var Asteroid = function(game, x, y, direction){
    key = 'asteroid';
    Phaser.Sprite.call(this, game, x, y, 'asteroid');
    this.scale.setTo(this.game.rnd.realInRange(0.1,0.5));
    this.anchor.setTo(0.5);
    this.animations.add('asteroidAnim', [], 10, true);
    this.animations.play('asteroidAnim');

    this.game.physics.arcade.enableBody(this);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Asteroid.SPEED;
    this.body.velocity.y = Asteroid.SPEED;
    this.body.angularVelocity = 20;

    Asteroid.SPEED = 50;

    this.direction = direction;
    this.maxUpperVel = 600;
    this.maxLowerVel = 200;
    this.maxAngularVel = 400;
};
    Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
    Asteroid.prototype.constructor = Asteroid;
    Asteroid.prototype.update= function() {
        this.body.velocity.x = 0;
        this.body.angularVelocity = this.game.rnd.integerInRange(100, this.maxAngularVel);
    };


var player;
var weapon;
var fireButton;
var bullet;
var asteroidsGroup;
var asteroidCount; 

var level2 = {
    preload: function() {
      game.load.image('level2Background', 'assets/level2bg.jpg');  
      game.load.image('rocket', 'assets/playerShip1_orange.png');
      game.load.image('bullet', 'assets/laserPurple.png');

      game.load.spritesheet('asteroid', 'assets/asteroid.png', 128, 128);

    },
    create: function() {
        this.camera.flash('#000000');
        //background
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, 0, 'level2Background');

        weapon = game.add.weapon(30, 'bullet');
        weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        weapon.bulletLifespan = 2000;
        weapon.bulletSpeed = 600;
        weapon.fireRate = 60;
        weapon.bulletAngleVariance = 10;


        player = game.add.sprite(420, 710, 'rocket');
        game.physics.arcade.enable(player);
        player.anchor.set(0.5);
        player.body.collideWorldBounds = true;


        weapon.trackSprite(player, 0, 0, false);
        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        asteroidsGroup = game.add.group();
        asteroidsGroup.enableBody = true; 
        for(i=0; i<10; i++){
            createAsteroid(); 
            asteroidCount = 10; 
        }
        if(asteroidCount < 10){
            createAsteroid();
            asteroidCount++; 
        }


        // HUD display
        scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '22px', fill: '#ffffff' });
        livesText = game.add.text(640, 40, 'Lives: 3', { fontSize: '20px', fill: '#ffffff' });
        highScoreText = game.add.text(640, 16, 'High score: '+localStorage.highScore, { fontSize: '20px', fill: '#ffffff' });
    },

    update: function() {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        if (cursors.left.isDown){
            player.body.velocity.x = -150;
        }else if (cursors.right.isDown){
           player.body.velocity.x = 150;
        }
        if (cursors.up.isDown){
            player.body.velocity.y = -150;
        }else if (cursors.down.isDown){
            player.body.velocity.y = 150;
        }
        if (fireButton.isDown){
                weapon.fire();
        }

        game.physics.arcade.overlap(player, asteroidsGroup, this.killPlayer, null, this);
        game.physics.arcade.overlap(weapon.bullets, asteroidsGroup, this.killAsteroid, null, this);
    },
    killPlayer: function(player, asteroid){
         game.sound.play('deathNoise');           
        loseLife();
    },
    killAsteroid: function(bullet, asteroid){
        asteroid.kill(); 
        asteroidCount--;
        bullet.kill();     
        game.sound.play('killNoise');
        increaseScore(); 
    },
    }
      
function createAsteroid() {
        var x = game.rnd.integerInRange(100, 700);
        var y = game.rnd.integerInRange(0, 100);
        var newAsteroid = new Asteroid(this.game, x, y, 200, 'asteroid', 0);
        game.add.existing(newAsteroid); 
        asteroidsGroup.add(newAsteroid);   
}