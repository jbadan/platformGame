//STATE MANAGER

var game = new Phaser.Game(800, 800, 'phaser');
game.state.add('menu', menu);  
game.state.add('level1', level1);
game.state.add('level2', level2);
game.state.add('end', end); 
game.state.add('win', win);
game.state.start('level2');



/*Resources: 
http://blog.kumansenu.com/2016/04/patrolling-enemy-ai-with-phaser/
https://hacks.mozilla.org/2017/04/html5-games-workshop-make-a-platformer-game-with-javascript/
http://kenney.nl/
https://tutorialzine.com/2015/06/making-your-first-html5-game-with-phaser

*/