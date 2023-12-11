let interState = {
    preload: preloadAssets,
    create: createInter,
    update: updateInter
};

function preloadAssets() {
    game.load.image("inter", "assets/imgs/inter.jpg");
    game.load.image("bback", "assets/imgs/bback.png");
    game.load.image("bback2", "assets/imgs/bback2.png");
    game.load.image("bnext", "assets/imgs/bnext.png");
    game.load.image("bnext2", "assets/imgs/bnext2.png");
}

function createInter() {
    fondoInter = game.add.image(-160, 0, "inter");
    fondoInter.scale.setTo(0.56);

    timeText = game.add.text(320, 400, 'Time: ' + time, { fontSize: '40px', fill: '#FFFFFF' });

    bnext2 = game.add.button(530, 400, "bnext2", goToNextPart);
    bnext2.scale.setTo(0.7);
    bnext = game.add.image(530, 400, 'bnext');
    bnext.scale.setTo(0.7);
    bnext.visible = false;
    bnext2.inputEnabled = true;

    bback2 = game.add.button(150, 400, "bback2", VolverAtrasDelGameOver);
    bback2.scale.setTo(0.7);
    bback = game.add.image(150, 400, 'bback');
    bback.scale.setTo(0.7);
    bback.visible = false;
    bback2.inputEnabled = true;
}

function updateInter() {

    cursorOverButton();
    
}

function cursorOverButton() {
    if (bback2.input.pointerOver())
    {
        bback.visible = false;
    }
    else
    {
        bback.visible = true;
    }
    if (bnext2.input.pointerOver())
    {
        bnext.visible = false;
    }
    else
    {
        bnext.visible = true;
    }
}

function goToNextPart() {
    if (whatPart == 0) {
        game.state.start('partB');
    } 
    else if (whatPart == 1) {
        game.state.start('partC');
    } 
}

function VolverAtrasDelGameOver() {
    game.state.start('menu');
}