let partBstate = {
    preload: preloadAssetsPartB,
    create: initGamePartB,
    update: updateGamePartB
};

let move12, move01, move23, move40, move53, move64, move67, move76, move87, move78;

function preloadAssetsPartB()
{
    game.load.image("trainer", "assets/imgs/entrenador.png");
    game.load.image("fondoPartB", "assets/imgs/partBwp.png");
    game.load.image("bug", "assets/imgs/bug2.png");
    game.load.text('wavesB', 'json/partB.json', true);
    game.load.image('pokeball','assets/imgs/pokeball.png');
    game.load.image('heart','assets/imgs/heart.png');
    game.load.image('healthbar','assets/imgs/healthbar.png');
    game.load.image('healthbarG','assets/imgs/healthbarG.png');
    game.load.image('healthbarBack','assets/imgs/healthbarBack.png');
    game.load.spritesheet("explosion","assets/imgs/Explosion.png",64,64);
    game.load.spritesheet("explosion2","assets/imgs/Explosion2.png",64,64);
    game.load.spritesheet("impact","assets/imgs/impact.png",48,48);
    game.load.audio('pop', 'assets/audio/pop.mp3');
    game.load.audio('splat', 'assets/audio/splat.mp3');
    game.load.audio('breakheart', 'assets/audio/breakheart.mp3');
    game.load.audio('heal', 'assets/audio/heal.mp3');
    game.load.audio('partBmusic', 'assets/audio/partBmusic.mp3');
    
}

function initGamePartB()
{
    whatPart = 1;
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

    partBmusic = game.add.audio('partBmusic');
    partBmusic.volume = 0.04;
    partBmusic.loop = true;
    partBmusic.play();
    
    game.physics.setBoundsToWorld();

    fondoGame = game.add.image(0, 0, "fondoPartB");
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

    waveText = game.add.text(290, 5, 'PART B : WAVE ' + N_WAVE+1);

    loadLevelB();
    createExplosions(EXPLOSIONS_GROUP_SIZE);
    createExplosions2(EXPLOSIONS_GROUP_SIZE);
    createImpacts(IMPACTS_GROUP_SIZE);
    createTrainer();
    createBugsB(N_WAVE);
    createPokeballs(POKEBALLS_GROUP_SIZE);
    createLifeItems(HPITEMS_GROUP_SIZE);
}


function updateGamePartB()
{
    manageTrainerMovements();
    manageTrainerShots();
    checkPokeballOutOfBounds();
    bugHitsFloor();
    swapBranchAuto();

    waveText.setText('PART B : WAVE ' + (N_WAVE+1));

    healthbar.scale.setTo(0.05*hp, 0.02);

    game.physics.arcade.overlap(bugs,pokeballs,pokeballHitsBugB,null,this);
    game.physics.arcade.overlap(trainer,bugs,bugHitsTrainerB,null,this);
    game.physics.arcade.overlap(pokeballs,lifeItems,pokeballHitsHeart,null,this);
    game.physics.arcade.overlap(trainer,lifeItems,heartHitsTrainer,null,this);

    //console.log('deadBugs');
    //console.log(deadBugs);

}

function createBugsB(number) {

    bugs = game.add.group();
    bugs.enableBody = true;
    bugs.createMultiple(22, 'bug');
    bugs.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    bugs.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    bugs.setAll('checkWorldBounds', true);
    game.physics.arcade.enable(bugs);

    //currentBugProbability = 0.2;
    createWaveB(number);

    //game.time.events.loop(TIMER_RHYTHM, activateBug, this);
}

function createWaveB(n) {
    currentBugVelocity = wavesB[n].speed;
    for (i = 0; i < wavesB[n].amount; i++) {
        game.time.events.add(Math.floor(Math.random() * wavesB[n].rate), activateBugB, this);
    };
}


function activateBugB() {
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

/*
function swapBranch()
{
    bugs.forEach(function(bug) {
        if (bug.x == 400 && bug.y >= 100 && bug.y <= 150)
        {
            if(bug.x < 700 && move == 1)
            {
                bug.body.velocity.x = 80;
            }
        }

        if(bug.x >= 700)
        {
            bug.body.velocity.x = 0;
        }
    }, this);
}
*/

function swapBranchAuto()
{
    bugs.forEach(function(bug) 
    {
        //(0-3)

        //1-2   

        if (bug.body.velocity.x==0)
        {
            //0-1    
            if(bug.x == (100+(600/(numBranch-1))*0)&& bug.y >=200 && bug.y <=250)
            {
                if(bug.x <= 700 && move01 == 0)
                {
                    bug.body.velocity.x = 80;
                }
            } 
            //1-2
            if (bug.x == (100 + (600/(numBranch-1)) * 1) && bug.y >= 100 && bug.y <= 150)
            {
                if(bug.x <= 700 && move12 == 0)
                {
                    bug.body.velocity.x = 81;
                }
            } 
            if (numBranch>3)
            {
                //2-3
                
                if (bug.x == (100 + (600/(numBranch-1)) * 2) && bug.y >= 100 && bug.y <= 150)
                {
                    if(bug.x <= 700 && move23 == 0)
                    {
                        bug.body.velocity.x = 82;
                    }
                } 
                if (numBranch>4)
                {
                    //4-0
                    if (bug.x == (100 + (600/(numBranch-1)) * 4) && bug.y >= 100 && bug.y <= 150)
                    {
                        

                        if(bug.x <= 700 && move40 == 0)
                        {
                            bug.body.velocity.x = -82;
                        }
                    }
                    if (numBranch>5)
                    {
                        //5-3
                        if (bug.x == (100 + (600/(numBranch-1)) * 5) && bug.y >= 100 && bug.y <= 150)
                        {
                            if(bug.x <= 700 && move53 == 0)
                            {
                                bug.body.velocity.x = -83;
                            }
                        }
                        if (numBranch>6)
                        {
                            //6-4
                            if (bug.x == (100 + (600/(numBranch-1)) * 6) && bug.y >= 100 && bug.y <= 150)
                            {
                                if(bug.x <= 700 && move64 == 0)
                                {
                                    bug.body.velocity.x = -84;
                                }
                            }
                            if (numBranch>7)
                            {
                                //6-7
                                if (bug.x == (100 + (600/(numBranch-1)) * 6) && bug.y >= 100 && bug.y <= 150)
                                {
                                    if(bug.x <= 700 && move67 == 0)
                                    {
                                        bug.body.velocity.x = 85;
                                        console.log("6-7");
                                    }
                                }
                                //7-6
                                if (bug.x == (100 + (600/(numBranch-1)) * 7) && bug.y >= 150 && bug.y <= 200)
                                {
                                    if(bug.x <= 700 && move76 == 0)
                                    {
                                        bug.body.velocity.x = -85;
                                    }
                                }
                                if (numBranch>8)
                                {
                                    //8-7
                                    if (bug.x == (100 + (600/(numBranch-1)) * 8) && bug.y >= 50 && bug.y <= 100)
                                    {
                                        if(bug.x <= 700 && move87 == 0)
                                        {
                                            bug.body.velocity.x = -86;
                                        }
                                    }
                                    //7-8
                                    if (bug.x == (100 + (600/(numBranch-1)) * 7) && bug.y >= 100 && bug.y <= 150)
                                    {
                                        if(bug.x <= 700 && move78 == 0)
                                        {
                                            bug.body.velocity.x = 86;
                                        }
                                    }

                                }

                            }

                        }

                    }

                }

            }

        }

        else
        {
            //0-1
            if(bug.x >= (100 + (600/(numBranch-1)) * 1 ) && bug.body.velocity.x==80)
            {
                bug.body.velocity.x = 0;
            }

            //1-2
            if(bug.x >= (100 + (600/(numBranch-1)) * 2 ) && bug.body.velocity.x==81)
            {
                bug.body.velocity.x = 0;
            }

            if(numBranch>3)
            {
                //2-3
                if(bug.x >= (100 + (600/(numBranch-1)) * 3 ) && bug.body.velocity.x==82)
                {
                    bug.body.velocity.x = 0;
                }
                if(numBranch>4)
                {
                    //4-0
                    if(bug.x <= (100 + (600/(numBranch-1)) * 0 ) && bug.body.velocity.x==-82)
                    {
                        bug.body.velocity.x = 0;
                    }

                    if (numBranch>5)
                    {
                        //5-3
                        if(bug.x <= (100 + (600/(numBranch-1)) * 3 ) && bug.body.velocity.x==-83)
                        {
                            bug.body.velocity.x = 0;
                        }
                        if (numBranch>6)
                        {
                            //6-4
                            if(bug.x <= (100 + (600/(numBranch-1)) * 4 ) && bug.body.velocity.x==-84)
                            {
                                bug.body.velocity.x = 0;
                            }
                            if (numBranch>7)
                            {
                                //6-7
                                if(bug.x >= (100 + (600/(numBranch-1)) * 7 ) && bug.body.velocity.x==85)
                                {
                                    bug.body.velocity.x = 0;
                                }
                                //7-6
                                if(bug.x <= (100 + (600/(numBranch-1)) * 6 ) && bug.body.velocity.x==-85)
                                {
                                    bug.body.velocity.x = 0;
                                }
                                if (numBranch>8)
                                {
                                    //8-7
                                    if(bug.x <= (100 + (600/(numBranch-1)) * 7 ) && bug.body.velocity.x==-86)
                                    {
                                        bug.body.velocity.x = 0;
                                    }
                                    //7-8
                                    if(bug.x >= (100 + (600/(numBranch-1)) * 8 ) && bug.body.velocity.x==86)
                                    {
                                        bug.body.velocity.x = 0;
                                    }
                                }

                            }

                        }

                    }

                }
            }

        }
    }, this);
}

function pokeballHitsBugB(bug, pokeball) {
    bug.kill();
    pokeball.kill();
    pokeballsArray.splice(pokeballsArray.indexOf(pokeball), 1);
    pop.play();
    score++;

    deadBugs++;
    if(deadBugs == wavesB[N_WAVE].amount)
    {
        N_WAVE++;
        nextWaveB(N_WAVE);
        deadBugs = 0;
    }

    scoreText.setText('Score: ' + score);

    lifeItemGenerator();
    displayExplosion(bug);
}

function bugHitsTrainerB(trainer, bug) {
    bug.kill();

    deadBugs++;
    if(deadBugs == wavesB[N_WAVE].amount)
    {
        N_WAVE++;
        nextWaveB(N_WAVE);
        deadBugs = 0;
    }

    bugTakesLife(bug);
}

function nextWaveB(n)
{
    if (n <= 2)
    {
        createBugsB(N_WAVE);
    }
    else
    {
        partBmusic.stop();
        game.state.start('inter');
    }
}

function loadLevelB() {
    let waveConfig = JSON.parse(game.cache.getText('wavesB'));
    loadWavesB(waveConfig);
}

function loadWavesB(waveConfig) {
    wavesB = waveConfig.wavesB;
}