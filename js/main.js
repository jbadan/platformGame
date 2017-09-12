/*TO DO LEVEL 1:
put creating info in JSON file
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


//BEGINS GAME

var game = new Phaser.Game(800, 800, 'phaser');
game.state.add('menu', menu);  
game.state.add('level1', level1);
game.state.add('end', end); 
game.state.add('win', win);
game.state.start('menu');



/*Resources: 
http://blog.kumansenu.com/2016/04/patrolling-enemy-ai-with-phaser/
https://hacks.mozilla.org/2017/04/html5-games-workshop-make-a-platformer-game-with-javascript/
http://kenney.nl/
https://tutorialzine.com/2015/06/making-your-first-html5-game-with-phaser

*/