let partCstate = {
    preload: preloadAssetsPartC,
    create: initGamePartC,
    update: updateGamePartC
};

let ghostArray = [];
let ghasts;

function preloadAssetsPartC()
{
    game.load.image("trainer", "assets/imgs/entrenador.png");
    game.load.image("fondoPartC", "assets/imgs/partCwp.png");
    game.load.image("1", "assets/imgs/bug2.png");
    game.load.text('wavesC', 'json/partC.json', true);
    game.load.image('pokeball','assets/imgs/pokeball.png');
    game.load.image('heart','assets/imgs/heart.png');
    game.load.image('healthbar','assets/imgs/healthbar.png');
    game.load.image('healthbarG','assets/imgs/healthbarG.png');
    game.load.image('healthbarBack','assets/imgs/healthbarBack.png');
    game.load.image('bug', 'assets/imgs/bug2.png');
    game.load.image('gastly', 'assets/imgs/gastly.png');
    game.load.spritesheet("explosion","assets/imgs/Explosion.png",64,64);
    game.load.spritesheet("explosion2","assets/imgs/Explosion2.png",64,64);
    game.load.spritesheet("impact","assets/imgs/impact.png",48,48);
    game.load.audio('pop', 'assets/audio/pop.mp3');
    game.load.audio('splat', 'assets/audio/splat.mp3');
    game.load.audio('breakheart', 'assets/audio/breakheart.mp3');
    game.load.audio('heal', 'assets/audio/heal.mp3');
    game.load.audio('partCmusic', 'assets/audio/partCmusic.mp3');
}

function initGamePartC()
{
    whatPart = 2;
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

    partCmusic = game.add.audio('partCmusic');
    partCmusic.volume = 0.04;
    partCmusic.loop = true;
    partCmusic.play();
    
    game.physics.setBoundsToWorld();

    fondoGame = game.add.image(0, 0, "fondoPartC");
    fondoGame.scale.setTo(0.6);

    healthbarBack = game.add.image(11, 567, "healthbarBack");
    healthbarBack.scale.setTo(0.21, 0.03);

    healthbarG = game.add.image(15, 570, "healthbarG");
    healthbarG.scale.setTo(0.2, 0.02);
    
    healthbar = game.add.image(15, 570, "healthbar");
    healthbar.scale.setTo(0.2, 0.02);

    timeText = game.add.text(5, 5, 'Time: ' + time);
    game.time.events.loop(1000, updateTime, this);

    scoreText = game.add.text(5, 40, 'Score: ' + score);

    waveText = game.add.text(290, 5, 'PART C : WAVE ' + N_WAVE+1);

    loadLevelC();
    createExplosions(EXPLOSIONS_GROUP_SIZE);
    createExplosions2(EXPLOSIONS_GROUP_SIZE);
    createImpacts(IMPACTS_GROUP_SIZE);
    createTrainer();
    createPokeballs(POKEBALLS_GROUP_SIZE);
    createLifeItems(HPITEMS_GROUP_SIZE);
    createBugsC(N_WAVE);
    createGhast(N_WAVE);
}


function updateGamePartC()
{
    manageTrainerMovements();
    manageTrainerShots();
    checkPokeballOutOfBounds();
    ghastHitsFloor();
    bugHitsFloor();
    swapBranchAuto();

    waveText.setText('PART C : WAVE ' + (N_WAVE+1));

    healthbar.scale.setTo(0.05*hp, 0.02);

    game.physics.arcade.overlap(bugs,pokeballs,pokeballHitsBugC,null,this);
    game.physics.arcade.overlap(ghasts,pokeballs,pokeballHitsGhast,null,this);
    game.physics.arcade.overlap(trainer,bugs,bugHitsTrainerC,null,this);
    game.physics.arcade.overlap(pokeballs,lifeItems,pokeballHitsHeart,null,this);
    game.physics.arcade.overlap(trainer,lifeItems,heartHitsTrainer,null,this);
}

function createBugsC(number) {

  bugs = game.add.group();
  bugs.enableBody = true;
  bugs.createMultiple(22, 'bug');
  bugs.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
  bugs.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
  bugs.setAll('checkWorldBounds', true);
  game.physics.arcade.enable(bugs);

  //currentBugProbability = 0.2;
  createWaveC(number);

  //game.time.events.loop(TIMER_RHYTHM, activateBug, this);
}

function createWaveC(n) {
  currentBugVelocity = wavesC[n].speed;
  for (i = 0; i < wavesC[n].amount; i++) {
      game.time.events.add(Math.floor(Math.random() * wavesC[n].rate), activateBugC, this);
  };
}


function activateBugC() {
  let bug = bugs.getFirstExists(false);
  let branch = Math.floor(Math.random() * numBranch);
  let x = 100 + (600/(numBranch-1)) * (branch);
  bug.reset(x, 0);
  bug.body.velocity.x = 0;
  bug.body.velocity.y = currentBugVelocity;

  move12 = Math.floor(Math.random() * 3);
  move01 = Math.floor(Math.random() * 3);
  move23 = Math.floor(Math.random() * 3);
  move40 = Math.floor(Math.random() * 3);
  move53 = Math.floor(Math.random() * 3);
  move64 = Math.floor(Math.random() * 3);
  move67 = Math.floor(Math.random() * 3);
  move76 = Math.floor(Math.random() * 3);
  move87 = Math.floor(Math.random() * 3);
  move78 = Math.floor(Math.random() * 3);
}


function createGhast(number) {
  ghasts = game.add.group();
  ghasts.enableBody = true;
  ghasts.createMultiple(22, 'gastly', 0, false);

  ghasts.forEach(function (ghast) {
    ghast.hitCount = 0; // Establecer la propiedad hitCount en 0 para cada sprite
  });

  ghasts.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
  ghasts.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
  ghasts.setAll('checkWorldBounds', true);
  game.physics.arcade.enable(ghasts);


  createWaveGhast(number);
}

function createWaveGhast(n) {
    currentBugVelocity = wavesC[n].speed;
    for (i = 0; i < wavesC[n].special; i++) {
        game.time.events.add(Math.floor(Math.random() * wavesC[n].rate), activateGhast, this);
    };
}


function activateGhast() {
    let ghast = ghasts.getFirstExists(false);
    let branch = Math.floor(Math.random() * numBranch);
    let x = 100 + (600/(numBranch-1)) * (branch);
    ghast.reset(x, 0);
    ghast.body.velocity.x = 0;
    ghast.body.velocity.y = currentBugVelocity;
}

function bugHitsTrainerC(trainer, bug) {
  bug.kill();

  deadBugs++;
  console.log(deadBugs);
  if(deadBugs == wavesC[N_WAVE].special)
  {
      N_WAVE++;
      deadBugs = 0;
      nextWaveC(N_WAVE);
  }

  bugTakesLife(bug);
}

function pokeballHitsGhast(ghast, pokeball) {
  console.log('ghast.hitCount: ', ghast.hitCount)
  ghast.hitCount += 1;// Incrementar el contador de golpes recibidos
  pokeball.kill();

  if (ghast.hitCount == 2)
  {
    ghast.kill();
    displayExplosion(ghast);
    deadBugs++;
    ghast.hitCount = 0;
    if(deadBugs == wavesC[N_WAVE].amount + wavesC[N_WAVE].special)
    {
        N_WAVE++;
        deadBugs = 0;
        nextWaveC(N_WAVE);
    }
    lifeItemGenerator();
  }
  else
  {
    // El enemigo necesita más golpes para morir
    // Realizar acciones adicionales o mostrar animaciones de impacto parcial
  }
  
  pokeballsArray.splice(pokeballsArray.indexOf(pokeball), 1);
  score++;
  pop.play();

  scoreText.setText('Score: ' + score);
}

function pokeballHitsBugC(bug, pokeball) {
  bug.kill();
  pokeball.kill();
  pokeballsArray.splice(pokeballsArray.indexOf(pokeball), 1);
  score++;
  pop.play();

  deadBugs++
  console.log(deadBugs);
  if(deadBugs == wavesC[N_WAVE].amount + wavesC[N_WAVE].special)
  {
      N_WAVE++;
      deadBugs = 0;
      nextWaveC(N_WAVE);
  }

  scoreText.setText('Score: ' + score);

  lifeItemGenerator();
  displayExplosion(bug);
}

function nextWaveC(n)
{
  if (n <= 2)
  {
      createWaveGhast(N_WAVE);
      createBugsC(N_WAVE);
  }
  else
  {
      game.time.events.add(500, goToGameOver, this);
  }
}


function ghastHitsFloor() {
  ghasts.forEach(function(ghast) {
      if (!ghast.hasDied && ghast.y > 575) {
          ghast.hasDied = true;
          ghast.kill();
          bugTakesLife(ghast);

          deadBugs++;
          if(deadBugs == wavesC[N_WAVE].amount + wavesC[N_WAVE].special)
          {
              N_WAVE++;
              deadBugs = 0;
              nextWaveC(N_WAVE);
          }
      }
  }, this);
}

function loadLevelC() {
    let waveConfig = JSON.parse(game.cache.getText('wavesC'));
    loadWavesC(waveConfig);
}

function loadWavesC(waveConfig) {
    wavesC = waveConfig.wavesC;
}


