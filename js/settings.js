let settingsState = {
    preload: preloadAssetsSettings,
    create: initSettings,
    update: updateSettings
};

let numBranch = 3;
let settingText;

let keyboardInputEnabled = true;

let branchTextTitle;
let branchStyleTitle = {
    font: "bold 34px italic",
    fill: "blue",
    align: "center"
};

function preloadAssetsSettings()
{
    game.load.image("fondoSettings", "assets/imgs/settings.jpg");
    game.load.image("leftArrow", "assets/imgs/leftArrow.png");
    game.load.image("rightArrow", "assets/imgs/rightArrow.png");
    game.load.image("atrasGameW", "assets/imgs/atrasGameW.png");
    game.load.image("kb", "assets/imgs/kb.png");
    game.load.image("kb2", "assets/imgs/kb2.png");
    game.load.image("mouse", "assets/imgs/mouse.png");
    game.load.image("mouse2", "assets/imgs/mouse2.png");
    game.load.audio('settingssound', 'assets/audio/settings.mp3');
    game.load.audio('abutton','assets/audio/abutton.mp3')
    game.load.audio('tap', 'assets/audio/tap.mp3');
}

function initSettings()
{
    settingssound = game.add.audio('settingssound');
    settingssound.volume = 0.1;
    settingssound.loop = true;
    settingssound.play();

    abutton = game.add.audio('abutton');
    abutton.volume = 0.1;

    tap = game.add.audio('tap');
    tap.volume = 0.1;

    fondoSettings = game.add.image(0, 0, "fondoSettings");
    fondoSettings.scale.setTo(0.5);

    leftArrow = game.add.button(300, 150, "leftArrow");
    leftArrow.scale.setTo(0.10);
    leftArrow.events.onInputDown.add(subBranch);

    rightArrow = game.add.button(450, 150, "rightArrow");
    rightArrow.scale.setTo(0.10);
    rightArrow.events.onInputDown.add(addBranch);

    atrasGame = game.add.button(20, 530, "atrasGameW");
    atrasGame.scale.setTo(0.1);
    atrasGame.events.onInputDown.add(VolverAtrasDelGame);

    mouse = game.add.button(450, 295, "mouse");
    mouse.scale.setTo(0.2);
    mouse.events.onInputDown.add(mouseInput);
    mouse2 = game.add.button(450, 295, "mouse2");
    mouse2.scale.setTo(0.2);
    mouse2.visible = false;
    
    kb = game.add.button(200, 300, "kb");
    kb.scale.setTo(0.2);
    kb.events.onInputDown.add(kbInput);
    kb2 = game.add.button(200, 300, "kb2");
    kb2.scale.setTo(0.2);
    kb2.visible = true;

    branchTextTitle = numBranch.toString();


    settingText = game.add.text(390, 155, branchTextTitle, branchStyleTitle);

    let textTitle2 = 'Branch Number\n\n\nControl Style\n\n\nSound';
    let styleTitle2 = {
        font: "bold 40px Arial",
        fill: "black",
        align: "center"
    };
    game.add.text(250, 80, textTitle2, styleTitle2);
}


function updateSettings()
{
    settingText.text = numBranch.toString();
    botonAtrasGame();
}

function mouseInput() {
    keyboardInputEnabled = false;
    kb2.visible = false;
    mouse2.visible = true;
    tap.play();
}

function kbInput() {
    keyboardInputEnabled = true;
    kb2.visible = true;
    mouse2.visible = false;
    tap.play();
}

function subBranch()
{
    if(numBranch > 3)
    {
        abutton.play();
        numBranch -= 1;
    }
    else tap.play();
}

function addBranch()
{
    if(numBranch < 9)
    {
        abutton.play();
        numBranch += 1;
    }
    else tap.play();
}

function botonAtrasGame() {
    if (atrasGame.input.pointerOver())
    {
        atrasGame.scale.setTo(0.11);
    }
    else
    {
        atrasGame.scale.setTo(0.1);
    }
}

function VolverAtrasDelGame() {
    settingssound.stop();
    game.state.start('menu');
}