let mainstate = {
    preload: preloadAssets,
    create: initGame,
    update: updateGame
};

let whatPart = 0;
var partNumber = 0;

function preloadAssets() {
    game.load.image("menuBg", "assets/imgs/menuBg.jpg");

    game.load.image("botonPlay", "assets/imgs/botonPlay.png");
    game.load.image("botonAbout", "assets/imgs/botonOptions.png");

    game.load.image("botonPlayNaranja", "assets/imgs/botonPlayNaranja.png");
    game.load.image("botonAboutNaranja", "assets/imgs/botonOptionsNaranja.png");

    game.load.image("leftArrow", "assets/imgs/leftArrow.png");
    game.load.image("rightArrow", "assets/imgs/rightArrow.png");
    game.load.image("spacebar", "assets/imgs/spacebar.png");

    game.load.image("mouseC", "assets/imgs/mouseC.png");
    game.load.image("mouseL", "assets/imgs/mouseL.png");
    game.load.image("mouseR", "assets/imgs/mouseR.png");
    
    game.load.audio('menu', 'assets/audio/menu.mp3');
    game.load.audio('tap', 'assets/audio/tap.mp3');
}

function initGame() {
    menu = game.add.audio('menu');
    menu.volume = 0.1;
    menu.loop = true;
    menu.play();

    tap = game.add.audio('tap');
    tap.volume = 0.1;

    let w = game.world.witdh;
    let h = game.world.height;

    //bg = game.add.tileSprite(12, 0, w, h, 'bg');
    //bg2 = game.add.tileSprite(283, 0, w, h, 'bg');

    menuBg = game.add.image(0, 0, "menuBg");
    menuBg.scale.setTo(0.63);

    leftArrow = game.add.image(195, 160, "leftArrow");
    leftArrow.scale.setTo(0.10);

    rightArrow = game.add.image(195, 230, "rightArrow");
    rightArrow.scale.setTo(0.10);

    spacebar = game.add.image(165, 300, "spacebar");
    spacebar.scale.setTo(0.40);

    mouseL = game.add.image(550, 150, "mouseL");
    mouseL.scale.setTo(0.15);

    mouseR = game.add.image(550, 220, "mouseR");
    mouseR.scale.setTo(0.15);
    
    mouseC = game.add.image(550, 290, "mouseC");
    mouseC.scale.setTo(0.15);

    textTitle = 'PokeShoot';
    let styleTitle = {
        font: "bold 80px blackitalic",
        fill: 'red'
    };

    let textTitle2 = 'GO LEFT\n\nGO RIGHT\n\nSHOOT';
    let styleTitle2 = {
        font: "bold 26px Arial",
        fill: "black",
        align: "center"
    };

    let textTitle3 = 'Sergio Juan Pérez Jiménez\nÁngel Martínez Gómez\nReyes del Viejo Gómez';
    let styleTitle3 = {
        font: "bold 18px Arial",
        fill: "white",
        align: "right"
    };

    game.add.text(230, game.world.height / 12, textTitle, styleTitle);
    game.add.text(340, 170, textTitle2, styleTitle2);
    game.add.text(530, 465, textTitle3, styleTitle3);

    textTitle.boundsAlignH = 'center';

    
    //PLACE BUTTONS
    botonPlayNaranja = game.add.button(40, (game.world.height/2)+100, "botonPlayNaranja", ApretarBotonPlay);
    botonPlayNaranja.scale.setTo(0.7);
    botonPlay = game.add.image(40, (game.world.height/2)+100, 'botonPlay');
    botonPlay.scale.setTo(0.7);
    botonPlay.visible = false;
    botonPlayNaranja.inputEnabled = true;

    botonAboutNaranja = game.add.button(40, (game.world.height/2)+175, 'botonAboutNaranja',ApretarBotonAbout );
    botonAboutNaranja.scale.setTo(0.7);
    botonAbout = game.add.image(40, (game.world.height/2)+175, 'botonAbout');
    botonAbout.scale.setTo(0.7);
    botonAbout.visible = false;
    botonAboutNaranja.inputEnabled = true;

    //game.input.addMoveCallback(p, this);
}

function updateGame() {
    //bg.tilePosition.y += 0.2;
    //bg2.tilePosition.y -= 0.2;

    botonPlayN();
    botonAboutN();
}

function botonPlayN() {
    if (botonPlayNaranja.input.pointerOver())
    {
        botonPlay.visible = false;
    }
    else
    {
        botonPlay.visible = true;
    }
}

function botonAboutN() {
    if (botonAboutNaranja.input.pointerOver())
    {
        botonAbout.visible = false;
    }
    else
    {
        botonAbout.visible = true;
    }
}

function ApretarBotonAbout () {
    menu.stop();
    tap.play();
    game.state.start('settings');
}

function ApretarBotonPlay () {
    menu.stop();
    tap.play();
    game.state.start('selectPart');
    //game.state.start('inter');
}