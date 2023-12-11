let gameoverState = {
    preload: preloadAssets,
    create: createGameOver,
    update: updateGameOver
};

function preloadAssets() {
    game.load.image("fondoGameOver", "assets/imgs/gameOverScreen.jpg");
    game.load.image("lose", "assets/imgs/lose.jpg");
    game.load.image("atrasGameOver", "assets/imgs/atrasGameW.png");
}

function createGameOver() {
    if (!gameLost) fondoGameOver = game.add.image(170, 40, "fondoGameOver");
    else fondoGameOver = game.add.image(170, 40, "lose");
    fondoGameOver.scale.setTo(0.5);

    atrasGameOver = game.add.button(60, 500, "atrasGameOver", VolverAtrasDelGameOver);
    atrasGameOver.scale.setTo(0.1);

    timeText = game.add.text(320, 400, 'Time: ' + time, { fontSize: '40px', fill: '#FFFFFF' });
    scoreText = game.add.text(320, 450, 'Score: ' + score, { fontSize: '40px', fill: '#FFFFFF' });

}

function updateGameOver() {

    botonAtrasGameOver();
    
}

function botonAtrasGameOver() {
    if (atrasGameOver.input.pointerOver())
    {
        atrasGameOver.scale.setTo(0.11);
    }
    else
    {
        atrasGameOver.scale.setTo(0.1);
    }
}

function VolverAtrasDelGameOver() {
    game.state.start('menu');
}