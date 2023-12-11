let partAstate = {
    preload: preloadAssetsPartA,
    create: initGamePartA,
    update: updateGamePartA
};

let trainer;
let fireButton;

let hp = 4;

let N_WAVE = 0;
let bugs;

const GAME_STAGE_WIDTH = 800;
const GAME_STAGE_HEIGHT = 600;
const LEFT_EDGE = 74.5;
const RIGHT_EDGE = 674.5;

let time = 0;
const TIMER_RHYTHM = 0.2 * Phaser.Timer.SECOND;

let score = 0;

const EXPLOSIONS_GROUP_SIZE = 30;
let explosions;
let explosions2;
const IMPACTS_GROUP_SIZE = 30;
let impacts;

let currentBugProbability;
let currentBugVelocity;

const POKEBALLS_GROUP_SIZE = 40;
let pokeballs;
const POKEBALLS_OFFSET_Y = 35;
const POKEBALLS_VELOCITY = 500;

const HPITEMS_GROUP_SIZE = 40;
const currentLifeItemVelocity = 50;
let lifeItems;

let pokeballsArray = [];

let bugsCreated = 0;
let deadBugs = 0;


//let numBranch = 6;



function preloadAssetsPartA()
{
    game.load.image("trainer", "assets/imgs/entrenador.png");
    game.load.image("fondoPartA", "assets/imgs/partAwp.png");
    game.load.image("bug", "assets/imgs/bug2.png");
    game.load.text('waves', 'json/partA.json', true);
    game.load.image('pokeball','assets/imgs/pokeball.png');
    game.load.image('heart','assets/imgs/heart.png');
    game.load.image('healthbar','assets/imgs/healthbar.png');
    game.load.image('healthbarG','assets/imgs/healthbarG.png');
    game.load.image('healthbarBack','assets/imgs/healthbarBack.png');
    game.load.image('gastly', 'assets/imgs/gastly.png');
    game.load.spritesheet("explosion","assets/imgs/Explosion.png",64,64);
    game.load.spritesheet("explosion2","assets/imgs/Explosion2.png",64,64);
    game.load.spritesheet("impact","assets/imgs/impact.png",48,48);
    game.load.audio('pop', 'assets/audio/pop.mp3');
    game.load.audio('splat', 'assets/audio/splat.mp3');
    game.load.audio('breakheart', 'assets/audio/breakheart.mp3');
    game.load.audio('heal', 'assets/audio/heal.mp3');
    game.load.audio('partAmusic', 'assets/audio/partAmusic.mp3');
}

function initGamePartA()
{
    whatPart = 0;
    N_WAVE = 0;
    pokeballsArray = [];

    pop = game.add.audio('pop');
    pop.volume = 0.1;
    splat = game.add.audio('splat');
    splat.volume = 0.1;
    breakheart = game.add.audio('breakheart');
    breakheart.volume = 0.1;
    heal = game.add.audio('heal');
    heal.volume = 0.2;

    partAmusic = game.add.audio('partAmusic');
    partAmusic.volume = 0.04;
    partAmusic.loop = true;
    partAmusic.play();
    
    game.physics.setBoundsToWorld();

    fondoGame = game.add.image(0, 0, "fondoPartA");
    fondoGame.scale.setTo(0.54);

    healthbarBack = game.add.image(11, 567, "healthbarBack");
    healthbarBack.scale.setTo(0.21, 0.03);

    healthbarG = game.add.image(15, 570, "healthbarG");
    healthbarG.scale.setTo(0.2, 0.02);
    
    healthbar = game.add.image(15, 570, "healthbar");
    healthbar.scale.setTo(0.2, 0.02);

    timeText = game.add.text(5, 5, 'Time: ' + time);
    game.time.events.loop(1000, updateTime, this);

    scoreText = game.add.text(5, 40, 'Score: ' + score);

    waveText = game.add.text(290, 5, 'PART A : WAVE ' + (N_WAVE+1));

    loadLevel();
    createExplosions(EXPLOSIONS_GROUP_SIZE);
    createExplosions2(EXPLOSIONS_GROUP_SIZE);
    createImpacts(IMPACTS_GROUP_SIZE);
    createTrainer();
    createBugs(N_WAVE);
    createPokeballs(POKEBALLS_GROUP_SIZE);
    createLifeItems(HPITEMS_GROUP_SIZE);
}


function updateGamePartA()
{
    manageTrainerMovements();
    manageTrainerShots();
    checkPokeballOutOfBounds();
    bugHitsFloor();

    waveText.setText('PART A : WAVE ' + (N_WAVE+1));

    healthbar.scale.setTo(0.05*hp, 0.02);

    game.physics.arcade.overlap(bugs,pokeballs,pokeballHitsBug,null,this);
    game.physics.arcade.overlap(trainer,bugs,bugHitsTrainer,null,this);
    game.physics.arcade.overlap(pokeballs,lifeItems,pokeballHitsHeart,null,this);
    game.physics.arcade.overlap(trainer,lifeItems,heartHitsTrainer,null,this);

    //console.log(deadBugs);
}

function createTrainer()
{
    let x = 100;
    let y = game.world.height - 70;
    trainer = game.add.sprite(x, y, 'trainer');
    trainer.anchor.setTo(0.5, 0.5);

    createKeyControls();
    game.physics.arcade.enable(trainer);
}

function createKeyControls()
{
    cursors = game.input.keyboard.createCursorKeys();

    //TO READ SPACEBAR
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    click = game.input.mousePointer.leftButton;
    //click = game.input.addPointer(Phaser.Mouse.LEFT_BUTTON)
}

function manageTrainerMovements()
{
    TRAINER_VELOCITY = 600/(numBranch-1);
    trainer.body.velocity.x = 0;

    if (keyboardInputEnabled) {
        if (cursors.left.justDown && trainer.body.x > LEFT_EDGE) // TECLADO
        {
            trainer.body.x -= TRAINER_VELOCITY;
        }

        else if (cursors.right.justDown && trainer.body.x < RIGHT_EDGE) // RATÓN
        {
            trainer.body.x += TRAINER_VELOCITY;
        }
    }   

    else {
        if (game.input.x < trainer.body.x - TRAINER_VELOCITY/2 + 25.5 && trainer.body.x > LEFT_EDGE) //RATON 
        {
            trainer.body.x -= TRAINER_VELOCITY;
        }
        else if (game.input.x > trainer.body.x + TRAINER_VELOCITY/2 + 25.5 && trainer.body.x < RIGHT_EDGE) //RATON 
        {
            trainer.body.x += TRAINER_VELOCITY;
        }
    }
}

function createPokeballs(number) {
    pokeballs = game.add.group();
    pokeballs.enableBody = true;
    pokeballs.createMultiple(number, 'pokeball');
    pokeballs.callAll('events.onOutOfBounds.add','events.onOutOfBounds', resetMember);
    pokeballs.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    pokeballs.setAll('checkWorldBounds', true);
}
    

function resetMember(item) {
    item.kill();
} 

function manageTrainerShots() {
    // Verificar si el botón de disparo ha sido presionado y si no hay una pokeball en la misma columna vertical que el jugador
    if (keyboardInputEnabled) {
        if (fireButton.justDown && !pokeballExistsOnColumn(trainer.x)) {
            firePokeballs();
        }
    }
    else {
        if(click.justPressed(30) && !pokeballExistsOnColumn(trainer.x)){
            firePokeballs();
        }
    }
}

function pokeballExistsOnColumn(x) {
    // Verifies that there is no current pokeball in the column
    for (let i = 0; i < pokeballsArray.length; i++) {
        let pokeball = pokeballsArray[i];
        if (pokeball.x == x) {
            return true;
        }
    }
    return false;
}

function firePokeballs() {
    let x = trainer.x;
    let y = trainer.y - POKEBALLS_OFFSET_Y;
    let vy = -POKEBALLS_VELOCITY;
    let pokeball = shootPokeball(x, y, vy);
    pokeballsArray.push(pokeball);
}

function shootPokeball(x, y, vy) {
    let shot = pokeballs.getFirstExists(false);
    if (shot) {
        shot.reset(x, y);
        shot.body.velocity.y = vy;
    }
    return shot;
}

function checkPokeballOutOfBounds() {
    pokeballsArray.forEach(function (pokeball) {
        if (pokeball.y < 0 || pokeball.y > game.height) {
            pokeball.kill();
            pokeballsArray.splice(pokeballsArray.indexOf(pokeball), 1);
        }
    });
}

function createLifeItems(number){
    lifeItems = game.add.group();
    lifeItems.enableBody = true;
    lifeItems.createMultiple(number, 'heart');
    lifeItems.callAll('events.onOutOfBounds.add','events.onOutOfBounds', resetMember);
    lifeItems.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    lifeItems.setAll('checkWorldBounds', true);
}

function spawnLifeItem() {
    let lifeItem = lifeItems.getFirstExists(false);
    let branch = Math.floor(Math.random() * numBranch);
    let x = 100 + (600/(numBranch-1)) * (branch);
    lifeItem.reset(x, 0);
    lifeItem.body.velocity.x = 0;
    lifeItem.body.velocity.y = currentLifeItemVelocity;
}

function createExplosions(number) {
    explosions = game.add.group();
    explosions.createMultiple(number, 'explosion');
    explosions.forEach(setupExplosion, this);
}

function setupExplosion(explosion) {
    explosion.anchor.x = 0.5;
    explosion.anchor.y = 0.5;
    explosion.animations.add('explosion');
}

function displayExplosion(bug) {
    let explosion = explosions.getFirstExists(false);
    let x = bug.body.center.x;
    let y = bug.body.center.y;
    explosion.reset(x, y);
    explosion.play('explosion', 20, false, true);
}

function createExplosions2(number) {
    explosions2 = game.add.group();
    explosions2.createMultiple(number, 'explosion2');
    explosions2.forEach(setupExplosion2, this);
}

function setupExplosion2(explosion2) {
    explosion2.anchor.x = 0.5;
    explosion2.anchor.y = 0.5;
    explosion2.animations.add('explosion2');
}

function displayExplosion2(bug) {
    let explosion2 = explosions2.getFirstExists(false);
    let x = bug.body.center.x;
    let y = bug.body.center.y;
    explosion2.reset(x, y);
    explosion2.play('explosion2', 20, false, true);
}

function createImpacts(number) {
    impacts = game.add.group();
    impacts.createMultiple(number, 'impact');
    impacts.forEach(setupImpact, this);
}

function setupImpact(impact) {
    impact.anchor.x = 0.5;
    impact.anchor.y = 0.5;
    impact.animations.add('impact');
}

function displayImpact(bug) {
    let impact = impacts.getFirstExists(false);
    let x = bug.body.center.x;
    let y = bug.body.center.y + 20;
    if (impact) { // Comprobación si el objeto impact existe y no está en uso
        impact.reset(x, y);
        impact.play('impact', 20, false, true);
    }
}

function createBugs(number) {

    bugs = game.add.group();
    bugs.enableBody = true;
    bugs.createMultiple(22, 'bug');
    bugs.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    bugs.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    bugs.setAll('checkWorldBounds', true);
    game.physics.arcade.enable(bugs);

    //currentBugProbability = 0.2;
    createWave(number);

    //game.time.events.loop(TIMER_RHYTHM, activateBug, this);
}

function createWave(n) {
    currentBugVelocity = waves[n].speed;
    for (i = 0; i < waves[n].amount; i++) {
        game.time.events.add(Math.floor(Math.random() * waves[n].rate), activateBug, this);
    };
}


function activateBug() {
    let bug = bugs.getFirstExists(false);
    let branch = Math.floor(Math.random() * numBranch);
    let x = 100 + (600/(numBranch-1)) * (branch);
    bug.reset(x, 0);
    bug.body.velocity.x = 0;
    bug.body.velocity.y = currentBugVelocity;
}

function nextWave(n)
{
    if (n <= 2)
    {
        createBugs(N_WAVE);
    }
    else
    {
        partAmusic.stop();
        game.time.events.add(500, goToInter, this);
    }
}

function pokeballHitsBug(bug, pokeball) {
    bug.kill();
    pokeball.kill();
    pokeballsArray.splice(pokeballsArray.indexOf(pokeball), 1);
    score++;
    pop.play();

    deadBugs++;
    if(deadBugs == waves[N_WAVE].amount)
    {
        N_WAVE++;
        nextWave(N_WAVE);
        deadBugs = 0;
    }

    scoreText.setText('Score: ' + score);

    lifeItemGenerator();
    displayExplosion(bug);
}

function bugHitsTrainer(trainer, bug) {
    bug.kill();

    deadBugs++;
    if(deadBugs == waves[N_WAVE].amount)
    {
        N_WAVE++;
        nextWave(N_WAVE);
        deadBugs = 0;
    }

    bugTakesLife(bug);
}

function pokeballHitsHeart(pokeball, heart) {
    heart.kill();
    pokeball.kill();
    pokeballsArray.splice(pokeballsArray.indexOf(pokeball), 1);
    displayExplosion2(heart);
    breakheart.play();
}

function heartHitsTrainer(trainer, heart) {
    heart.kill();
    if (hp < 4) hp++;
    heal.play();
}

function bugHitsFloor() {
    bugs.forEach(function(bug) {
        if (!bug.hasDied && bug.y > 575) {
            bug.hasDied = true;
            bug.kill();
            bugTakesLife(bug);

            deadBugs++;
            if(whatPart == 0)
            {
                if (deadBugs == waves[N_WAVE].amount)
                {
                    N_WAVE++;
                    deadBugs = 0;
                    nextWave(N_WAVE);
                }
            }
            else if(whatPart == 1)
            {
                if (deadBugs == wavesB[N_WAVE].amount)
                {
                    N_WAVE++;
                    deadBugs = 0;
                    nextWaveB(N_WAVE);
                }
            }
            else if (whatPart == 2)
            {
                if (deadBugs == wavesC[N_WAVE].amount + wavesC[N_WAVE].special)
                {
                    N_WAVE++;
                    deadBugs = 0;
                    nextWaveC(N_WAVE);
                }
            }
        }
    }, this);
}

function bugTakesLife(bug) {
    displayImpact(bug);
    splat.play();
    hp--;
    gameLost = true;
    if (hp == 0) game.time.events.add(500, goToGameOver, this);
}

function lifeItemGenerator() {
    let n = Math.floor(Math.random() * 4);
    //console.log(n);
    if (n < 1) spawnLifeItem();
}

function updateTime() {
    time++;
    timeText.setText('Time: ' + time);
}

function goToGameOver() {
    game.state.start('gameover');
}

function goToPartB() {
    game.state.start('partB');
}

function goToInter() {
    game.state.start('inter');
} 

function loadLevel() {
    let waveConfig = JSON.parse(game.cache.getText('waves'));
    loadWaves(waveConfig);
}

function loadWaves(waveConfig) {
    waves = waveConfig.waves;
}