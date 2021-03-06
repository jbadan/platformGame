var Asteroid = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'asteroid');
    this.scale.setTo(this.game.rnd.realInRange(0.1,0.5));
    this.anchor.setTo(0.5);
    this.animations.add('asteroidAnim', [], 10, true);
    this.animations.play('asteroidAnim');

    this.game.physics.arcade.enableBody(this);
    this.game.physics.enable(this);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.body.angularVelocity = 20;
};
Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Asteroid.prototype.constructor = Asteroid;
Asteroid.prototype.update= function() {
        this.body.velocity.x = 0;
    };

var Ufo = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'ufo');
    this.anchor.setTo(0.5);
    this.animations.add('ufoAnim', [], 10, true);
    this.animations.play('ufoAnim');

    this.game.physics.arcade.enableBody(this);
    this.game.physics.enable(this);
    this.checkWorldBounds = true;

    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

};
    Ufo.prototype = Object.create(Phaser.Sprite.prototype);
    Ufo.prototype.constructor = Ufo;
    Ufo.prototype.update= function() {
        ufoGroup.forEachAlive(function(ufo){
            ufo.body.velocity.y = game.rnd.integerInRange(0, 20);
            ufo.body.velocity.x = 20;
            if(ufo.x >= 800){
                ufo.x = 0; 
            }
         })
    };

var player;
var weapon;
var fireButton;
var enemyBullet;
var bullet;
var asteroidsGroup;
var ufoGroup;
var alienWeapon; 
var firingTimer = 0;
var livingEnemies = [];
var heartGroup;
var heart1;
var heart2;
var heart3;

var level2 = {
    preload: function() {
      game.load.image('level2Background', 'assets/level2bg.jpg');  
      game.load.image('rocket', 'assets/playerShip1_orange.png');
      game.load.image('bullet', 'assets/laserPurple.png');
      game.load.image('enemyBullet', 'assets/laserRedBurst_50.png');
      game.load.image('heartFull', 'assets/hud_heartFull_1_50.png');
      game.load.image('heartEmpty', 'assets/hud_heartEmpty.png');
      game.load.audio('killNoise', 'assets/sound/hit.wav');

      game.load.spritesheet('asteroid', 'assets/asteroid.png', 128, 128);
      game.load.spritesheet('ufo', 'assets/ufo.png', 48, 48);

      game.load.audio('deathNoise', 'assets/sound/sadTrombone.wav');

    },
    create: function() {
        this.camera.flash('#000000');
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
        }

        ufoGroup = game.add.group();
        ufoGroup.enableBody = true;
        for(j=0; j<5; j++){
            createUfo();
        }

        // HUD display
        heartGroup = game.add.group();
        if(lives == 3){
            heart1 = heartGroup.create(640, 40, 'heartFull');
            heart2 = heartGroup.create(670, 40, 'heartFull');
            heart3 = heartGroup.create(700, 40, 'heartFull');
        }else if(lives ==2){
            heart1 = heartGroup.create(640, 40, 'heartFull');
            heart2 = heartGroup.create(670, 40, 'heartFull');
        }else if(lives == 1){
            heart1 = heartGroup.create(640, 40, 'heartFull');
        }
        scoreText = game.add.text(16, 16, 'Score: '+score, { fontSize: '22px', fill: '#ffffff' });
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
        var livingAsteroids = asteroidsGroup.countLiving();
        if(livingAsteroids < 10){
            createAsteroid();
        }
        var livingUfos = ufoGroup.countLiving();
        if(livingUfos == 0){
            game.state.start('win');
        }
        if (game.time.now > firingTimer)
        {
            enemyFires();
        }

        game.physics.arcade.overlap(player, asteroidsGroup, this.killPlayer, null, this);
        game.physics.arcade.overlap(weapon.bullets, asteroidsGroup, this.killAsteroid, null, this);
        game.physics.arcade.overlap(player, ufoGroup, this.killPlayer, null, this);
        game.physics.arcade.overlap(weapon.bullets, ufoGroup, this.killUfo, null, this);
        game.physics.arcade.collide(enemyBullets, player, this.enemyHitsPlayer, null, this);
    },
    killPlayer: function(player, asteroid){
         game.sound.play('deathNoise');
         asteroid.kill();           
        loseLife();
    },
    killAsteroid: function(bullet, asteroid){
        asteroid.kill();
        bullet.kill();     
        game.sound.play('killNoise');
        increaseScore(); 
    },
    killUfo: function(player, ufo){
        ufo.kill();
        var totalUfos = ufoGroup.length;
        if(totalUfos <= 10){
             createUfo();
        }
        game.sound.play('killNoise');
        increaseScore(); 
    },
    enemyHitsPlayer: function(player, bullet){
        bullet.kill();
        loseLife();

    }
}
      
function createAsteroid() {
        var x = game.rnd.integerInRange(100, 700);
        var y = game.rnd.integerInRange(20, 100);
        var newAsteroid = new Asteroid(this.game, x, y, 100, 'asteroid', 0);
        newAsteroid.body.velocity.y = game.rnd.integerInRange(10, 200);
        newAsteroid.body.angularVelocity = game.rnd.integerInRange(-50, 50);
        game.add.existing(newAsteroid); 
        asteroidsGroup.add(newAsteroid);   
}

function createUfo(){
    var x = game.rnd.integerInRange(100, 700);
    var y = game.rnd.integerInRange(20, 300);
    var newUfo = new Ufo(this.game, x, y, 'ufo', 0);
    game.add.existing(newUfo); 
    ufoGroup.add(newUfo); 
}

function enemyFires(){
    enemyBullet = enemyBullets.getFirstExists(false);
    livingEnemies.length=0;
    ufoGroup.forEachAlive(function(ufo){
        livingEnemies.push(ufo);
    });
    if (enemyBullet && livingEnemies.length > 0){
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);
        var shooter=livingEnemies[random];
        enemyBullet.reset(shooter.body.x, shooter.body.y);
        game.physics.arcade.moveToObject(enemyBullet,player,120);
        firingTimer = game.time.now + 2000;
    }
}