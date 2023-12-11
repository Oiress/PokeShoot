let selectPartState = {
    preload: preloadAssetsSelectPart,
    create: initGameSelectPart,
    update: updateGameSelectPart
};

let gameLost = false;

function preloadAssetsSelectPart()
{
    game.load.image("fondoGame", "assets/imgs/selectPart.webp");
    game.load.image("atrasGame", "assets/imgs/atrasGame.png");
    game.load.image("atrasGameW", "assets/imgs/atrasGameW.png");
    game.load.image("partA", "assets/imgs/partA.png");
    game.load.image("partB", "assets/imgs/partB.png");
    game.load.image("partC", "assets/imgs/partC.png");
    game.load.audio('money', 'assets/audio/money.mp3');
}

function initGameSelectPart()
{
    gameLost = false;
    hp = 4;
    score = 0;
    time = 0;

    money = game.add.audio('money');
    money.volume = 0.1;
    money.loop = true;
    money.play();

    fondoGame = game.add.image(0, 0, "fondoGame");
    fondoGame.scale.setTo(0.21);

    // CREATE BUTTONS
    botonPartA = game.add.button(351, 150, "partA", startPartA);
    botonPartB = game.add.button(351, 250, "partB", startPartB);
    botonPartC = game.add.button(351, 350, "partC", startPartC);
    atrasGame = game.add.button(20, 530, "atrasGameW", VolverAtrasSelect);
    atrasGame.scale.setTo(0.1);
}


function updateGameSelectPart()
{
    botonAtrasGame();
}

function botonAtrasSelect() {
    if (atrasGame.input.pointerOver())
    {
        atrasGame.scale.setTo(0.11);
    }
    else
    {
        atrasGame.scale.setTo(0.1);
    }
}

function VolverAtrasSelect() {
    money.stop();
    game.state.start('menu');
}

function startPartA()
{
    money.stop();
    game.state.start('partA');
}

function startPartB()
{
    money.stop();
    game.state.start('partB');
}

function startPartC()
{
    money.stop();
    game.state.start('partC');
}
