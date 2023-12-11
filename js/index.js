let game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');

window.onload = mainState;

function mainState () {
    game.state.add('menu', mainstate);
    game.state.add('partA', partAstate);
    game.state.add('partB', partBstate);
    game.state.add('partC', partCstate);
    game.state.add('selectPart', selectPartState);
    game.state.add('settings', settingsState);
    game.state.add('gameover', gameoverState);
    game.state.add('inter', interState);
    game.state.start('menu');
}