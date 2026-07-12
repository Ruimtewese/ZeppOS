import * as hmUI from "@zos/ui";
import { Accelerometer } from "@zos/sensor";
import { setStorageSync, getStorageSync } from "@zos/storage";
import { setPageBrightTime, resetPageBrightTime } from "@zos/display";


// =====================
// SCREEN
// =====================

const WIDTH = 390;
const HEIGHT = 450;


// =====================
// SENSOR
// =====================

const accel = new Accelerometer();

let lastValue = 0;
let canJump = false;

const FLICK_THRESHOLD = 80;
const COOLDOWN = 500;


// =====================
// GAME STATE
// =====================

let state = "MENU";
// MENU
// PLAYING
// GAMEOVER


let score = 0;
let bestScore = 0;


// =====================
// BIRD
// =====================

let bird;

let birdX = 80;
let birdY = 200;

let velocity = 0;

const GRAVITY = 0.24;
const JUMP_FORCE = -5.2;

const BIRD_SIZE = 16;


// =====================
// PIPES
// =====================

let pipes = [];

const PIPE_WIDTH = 35;
const PIPE_SPEED = 2;

const PIPE_GAP = 140;
const PIPE_DISTANCE = 180;


// =====================
// UI
// =====================

let scoreText;
let messageText;



// =====================
// CREATE PIPE
// =====================

function createPipe(){


    const MIN_Y = 120;
    const MAX_Y = 330;


    let gap =
        Math.floor(
            Math.random() *
            (MAX_Y - MIN_Y)
        )
        + MIN_Y;



    let topHeight =
        gap - PIPE_GAP / 2;


    let bottomStart =
        gap + PIPE_GAP / 2;



    let top =
        hmUI.createWidget(
            hmUI.widget.FILL_RECT,
            {
                x:WIDTH,
                y:0,
                w:PIPE_WIDTH,
                h:topHeight,
                color:0x00aa00
            }
        );



    let bottom =
        hmUI.createWidget(
            hmUI.widget.FILL_RECT,
            {
                x:WIDTH,
                y:bottomStart,
                w:PIPE_WIDTH,
                h:HEIGHT-bottomStart,
                color:0x00aa00
            }
        );



    pipes.push({

        x:WIDTH,
        gap:gap,

        top:top,
        bottom:bottom,

        passed:false

    });


}



// =====================
// CLEAR PIPES
// =====================

function clearPipes(){


    for(let p of pipes){

        hmUI.deleteWidget(p.top);
        hmUI.deleteWidget(p.bottom);

    }


    pipes=[];


}



// =====================
// START GAME
// =====================

function startGame(){


    clearPipes();


    score=0;


    scoreText.setProperty(
        hmUI.prop.TEXT,
        "Score: 0"
    );


    birdY=200;
    velocity=0;


    state="PLAYING";


    messageText.setProperty(
        hmUI.prop.TEXT,
        ""
    );


}



// =====================
// GAME OVER
// =====================

function gameOver(){


    state="GAMEOVER";


    messageText.setProperty(
        hmUI.prop.TEXT,
        "GAME OVER\nFlick to restart"
    );


}



// =====================
// COLLISION
// =====================

function checkCollision(){


    // ground

    if(birdY + BIRD_SIZE >= HEIGHT - 20)
    {
        return true;
    }



    // ceiling

    if(birdY <= 0)
    {
        return true;
    }



    for(let p of pipes){


        let hitX =
            birdX + BIRD_SIZE > p.x &&
            birdX < p.x + PIPE_WIDTH;



        if(hitX){


            let hitTop =
                birdY <
                p.gap - PIPE_GAP/2;



            let hitBottom =
                birdY + BIRD_SIZE >
                p.gap + PIPE_GAP/2;



            if(hitTop || hitBottom)
                return true;


        }


    }


    return false;


}



// =====================
// FLICK CONTROL
// =====================

accel.onChange(()=>{


    if(!canJump)
        return;



    let data =
        accel.getCurrent();



    let change =
        data.y - lastValue;



    if(change < -FLICK_THRESHOLD){


        if(state==="MENU")
        {
            startGame();
        }


        else if(state==="PLAYING")
        {
            velocity=JUMP_FORCE;
        }


        else if(state==="GAMEOVER")
        {
            startGame();
        }



        canJump=false;



        setTimeout(()=>{

            let d =
                accel.getCurrent();


            lastValue=d.y;

            canJump=true;


        },COOLDOWN);


    }



    lastValue=data.y;



});



// =====================
// PAGE
// =====================

Page({

build(){


    hmUI.setStatusBarVisible(false);

    setPageBrightTime({
    brightTime: 2147483000

});


    // BACKGROUND

    hmUI.createWidget(
        hmUI.widget.FILL_RECT,
        {
            x:0,
            y:0,
            w:WIDTH,
            h:HEIGHT,
            color:0x87ceeb
        }
    );



    // BIRD

    bird =
    hmUI.createWidget(
        hmUI.widget.FILL_RECT,
        {
            x:birdX,
            y:birdY,
            w:BIRD_SIZE,
            h:BIRD_SIZE,
            color:0xffff00
        }
    );



    // SCORE

    scoreText =
    hmUI.createWidget(
        hmUI.widget.TEXT,
        {
            x:10,
            y:10,
            w:150,
            h:40,
            text:"Score: 0",
            text_size:25,
            color:0xffffff
        }
    );



    // MESSAGE

    messageText =
    hmUI.createWidget(
        hmUI.widget.TEXT,
        {
            x:40,
            y:180,
            w:310,
            h:100,
            text:"FLAPPY BIRD\nFlick to start",
            text_size:30,
            color:0xffffff,
            align_h:hmUI.align.CENTER_H
        }
    );



    // SENSOR CALIBRATION

    setTimeout(()=>{


        let data =
            accel.getCurrent();


        lastValue=data.y;

        canJump=true;


    },2000);



    accel.start();



    // GAME LOOP

    setInterval(()=>{


        if(state!=="PLAYING")
            return;



        velocity += GRAVITY;

        birdY += velocity;



        bird.setProperty(
            hmUI.prop.Y,
            Math.round(birdY)
        );



        // CREATE PIPES

        if(
            pipes.length===0 ||
            pipes[pipes.length-1].x <
            WIDTH-PIPE_DISTANCE
        ){

            createPipe();

        }



        // MOVE PIPES

        for(let p of pipes){


            p.x -= PIPE_SPEED;



            p.top.setProperty(
                hmUI.prop.X,
                Math.round(p.x)
            );


            p.bottom.setProperty(
                hmUI.prop.X,
                Math.round(p.x)
            );



            if(
                !p.passed &&
                p.x < birdX
            ){

                p.passed=true;

                score++;


                scoreText.setProperty(
                    hmUI.prop.TEXT,
                    "Score: "+score
                );

            }


        }



        if(checkCollision())
        {
            gameOver();
        }



    },20);


// =====================
// PART 2
// VISUAL POLISH + GAME IMPROVEMENTS
// =====================


// =====================
// CLOUDS
// =====================

let clouds = [];


function createCloud(){


    let cloud =
    hmUI.createWidget(
        hmUI.widget.FILL_RECT,
        {
            x:WIDTH,
            y:
            Math.floor(Math.random()*120)+40,

            w:50,
            h:20,

            color:0xffffff
        }
    );


    clouds.push({

        x:WIDTH,
        widget:cloud

    });


}



// =====================
// GROUND
// =====================

let ground;


function createGround(){


    ground =
    hmUI.createWidget(
        hmUI.widget.FILL_RECT,
        {
            x:0,
            y:430,
            w:WIDTH,
            h:20,
            color:0x996633
        }
    );


}



// =====================
// BIRD ANIMATION
// =====================

let birdFrame = 0;

let birdAnimationTimer =
setInterval(()=>{


    if(state==="PLAYING"){


        birdFrame++;


        if(birdFrame%2===0){

            bird.setProperty(
                hmUI.prop.HEIGHT,
                18
            );

        }
        else{

            bird.setProperty(
                hmUI.prop.HEIGHT,
                14
            );

        }


    }


},150);



// =====================
// REMOVE OLD PIPES
// =====================

function removeOldPipes(){


    for(let i=pipes.length-1;i>=0;i--){


        if(pipes[i].x < -PIPE_WIDTH){


            hmUI.deleteWidget(
                pipes[i].top
            );


            hmUI.deleteWidget(
                pipes[i].bottom
            );


            pipes.splice(i,1);


        }


    }


}



// =====================
// REMOVE OLD CLOUDS
// =====================

function moveClouds(){


    for(let i=clouds.length-1;i>=0;i--){


        let c=clouds[i];


        c.x-=0.5;



        c.widget.setProperty(
            hmUI.prop.X,
            Math.round(c.x)
        );



        if(c.x<-60){


            hmUI.deleteWidget(
                c.widget
            );


            clouds.splice(i,1);


        }


    }



}



// =====================
// DIFFICULTY
// =====================

let difficultyTimer=0;


function increaseDifficulty(){


    difficultyTimer++;


    if(difficultyTimer>=500){


        difficultyTimer=0;



        if(PIPE_SPEED<5){

            // slowly increases difficulty

        }


    }


}



// =====================
// CREATE GROUND + CLOUDS
// =====================


// wait until page exists

setTimeout(()=>{


    createGround();


},100);



setInterval(()=>{


    if(
        state==="PLAYING" &&
        Math.random()<0.02
    ){

        createCloud();

    }



    moveClouds();



},20);



// =====================
// EXTRA GAME LOOP
// =====================

setInterval(()=>{


    if(state!=="PLAYING")
        return;



    removeOldPipes();


    increaseDifficulty();



},200);

// =====================
// PART 3
// SAVING + POLISH + FINISH
// =====================


// =====================
// HIGH SCORE STORAGE
// =====================





function loadBestScore(){


    let saved =
        getStorageSync(
            "flappy_best"
        );


    if(saved){

        bestScore =
        Number(saved);

    }


}



function saveBestScore(){


    if(score > bestScore){


        bestScore = score;


        setStorageSync(
            "flappy_best",
            bestScore
        );


    }


}



// =====================
// MEDAL SYSTEM
// =====================

function getMedal(){


    if(score >= 50)
        return "GOLD";


    if(score >= 25)
        return "SILVER";


    if(score >= 10)
        return "BRONZE";


    return "";


}



// =====================
// VIBRATION
// =====================

function vibrate(){


    try{


        hmUI.vibrate();


    }
    catch(e){


        console.log(
            "Vibration unavailable"
        );


    }


}



// =====================
// UPDATE GAME OVER
// =====================

let oldGameOver = gameOver;


gameOver=function(){


    saveBestScore();


    vibrate();



    let medal =
        getMedal();



    messageText.setProperty(
        hmUI.prop.TEXT,

        "GAME OVER\n"+
        "Score: "+score+
        "\nBest: "+bestScore+
        "\n"+
        medal+
        "\n\nFlick to restart"

    );



    state="GAMEOVER";

    

};



// =====================
// LOAD SCORE
// =====================

loadBestScore();



// =====================
// START SCREEN UPDATE
// =====================

messageText.setProperty(
    hmUI.prop.TEXT,

    "FLAPPY BIRD\n"+
    "Flick to start\n"+
    "Best: "+
    bestScore

);



// =====================
// SCORE EFFECT
// =====================

let lastScore=0;


setInterval(()=>{


    if(score>lastScore){


        lastScore=score;


        vibrate();


    }


},100);



// =====================
// FINAL CLEANUP
// =====================

setInterval(()=>{


    if(state==="GAMEOVER"){


        bird.setProperty(
            hmUI.prop.Y,
            Math.round(birdY)
        );


    }



},100);



// =====================
// END PAGE
// =====================



}

});
