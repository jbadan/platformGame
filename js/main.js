//STATE MANAGER

var game = new Phaser.Game(800, 800, 'phaser');
game.state.add('menu', menu);  
game.state.add('level1', level1);
game.state.add('level2', level2);
game.state.add('end', end); 
game.state.add('win', win);
game.state.start('menu');
