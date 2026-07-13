import * as hmUI from "@zos/ui";
import { onKey } from "@zos/interaction";
import { setInterval } from "@zos/timer";


// =====================
// SCREEN
// =====================

const WIDTH = 390;
const HEIGHT = 450;

// =====================
// GROUND SETTINGS
// =====================

const GROUND_HEIGHT = 20;
const GROUND_Y = HEIGHT - GROUND_HEIGHT;
const GROUND_COLOR = 0x8B4513;


// =====================
// BIRD
// =====================

let bird;

let birdY = 200;

let velocity = 0;


const GRAVITY = 0.18;

const JUMP_FORCE = -6;


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

let gameText;

let gameRunning = false;

let gameStarted = false;

// =====================
// SCORE
// =====================

let score = 0;

let scoreText;

// =====================
// DIFFICULTY
// =====================

let difficulty = 0;

const MAX_SPEED = 6;
const MIN_GAP = 90;
const MIN_DISTANCE = 120;

// =====================
// CREATE PIPE
// =====================

function createPipe(){


    let gapY =
        Math.floor(
            Math.random() * 180
        ) + 150;



let gap = getPipeGap();


let topHeight =
    gapY - gap / 2;


let bottomY =
    gapY + gap / 2;


    let top =
    hmUI.createWidget(
        hmUI.widget.FILL_RECT,
        {
            x:WIDTH,
            y:0,
            w:PIPE_WIDTH,
            h:topHeight,
            color:0x00ff00
        }
    );



    let bottom =
    hmUI.createWidget(
        hmUI.widget.FILL_RECT,
        {
            x:WIDTH,
            y:bottomY,
            w:PIPE_WIDTH,
            h:HEIGHT-bottomY,
            color:0x00ff00
        }
    );



pipes.push({

    x:WIDTH,

    gapY:gapY,

    topHeight:topHeight,

    bottomY:bottomY,

    top:top,

    bottom:bottom,

    passed:false

})};

function gameOver(){

    gameRunning = false;


    gameText.setProperty(
        hmUI.prop.TEXT,
        "GAME OVER\n\nScore: "
        + score +
        "\n\nPress Button"
    );

}




// =====================
// REMOVE OLD PIPES
// =====================

function removeOldPipes(){


    for(let i = pipes.length - 1; i >= 0; i--){


        if(pipes[i].x < -PIPE_WIDTH){


            hmUI.deleteWidget(
                pipes[i].top
            );


            hmUI.deleteWidget(
                pipes[i].bottom
            );


            pipes.splice(
                i,
                1
            );


        }


    }


}


// =====================
// CLEAR PIPES
// =====================

function clearPipes(){


    for(let p of pipes){


        hmUI.deleteWidget(
            p.top
        );


        hmUI.deleteWidget(
            p.bottom
        );


    }


    pipes = [];


}

// =====================
// START GAME
// =====================

function startGame(){


    clearPipes();


    birdY = 200;

    velocity = 0;

    score = 0;



    scoreText.setProperty(
        hmUI.prop.TEXT,
        "Score: 0"
    );



    gameText.setProperty(
        hmUI.prop.TEXT,
        ""
    );



    gameRunning = true;

    gameStarted = true;


}


function getPipeSpeed(){

    return Math.min(
        MAX_SPEED,
        PIPE_SPEED + score * 0.1
    );

}


function getPipeGap(){

    return Math.max(
        MIN_GAP,
        PIPE_GAP - score * 2
    );

}


function getPipeDistance(){

    return Math.max(
        MIN_DISTANCE,
        PIPE_DISTANCE - score * 2
    );

}

Page({

build(){



    hmUI.setStatusBarVisible(false);



    // =====================
    // BACKGROUND
    // =====================

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


// =====================
// GROUND
// =====================

hmUI.createWidget(
    hmUI.widget.FILL_RECT,
    {
        x:0,
        y:GROUND_Y,
        w:WIDTH,
        h:GROUND_HEIGHT,
        color:GROUND_COLOR
    }
);

gameText =
hmUI.createWidget(
    hmUI.widget.TEXT,
    {
        x:40,
        y:170,
        w:310,
        h:120,
        text:"FLAPPY BIRD\n\nPress Top Button To Start",
        text_size:20,
        color:0xffffff,
        align_h:hmUI.align.CENTER_H
    }
);


    // =====================
    // BIRD
    // =====================

    bird =
    hmUI.createWidget(
        hmUI.widget.FILL_RECT,
        {
            x:80,
            y:birdY,
            w:16,
            h:16,
            color:0xffff00
        }
    );




scoreText =
hmUI.createWidget(
    hmUI.widget.TEXT,
    {
        x:10,
        y:70,
        w:150,
        h:40,
        text:"Score: 0",
        text_size:25,
        color:0xffffff
    }
);



 // =====================
// BUTTON
// =====================

onKey({

callback:(key,event)=>{


    if(event !== 1)
        return true;



    if(key === 36){


        // START GAME
        if(!gameStarted){


            startGame();


        }


        // RESTART AFTER DEATH
        else if(!gameRunning){


            startGame();


        }


        // JUMP
        else{


            velocity = JUMP_FORCE;


        }


    }



    return true;


}

});





    // =====================
    // GAME LOOP
    // =====================

    setInterval(()=>{

        if(!gameRunning)
        return;



        // BIRD PHYSICS

        velocity += GRAVITY;


        birdY += velocity;



if(birdY < 0){

    gameOver();

}



     if(birdY + 16 >= GROUND_Y){

    gameOver();

}



        bird.setProperty(
            hmUI.prop.Y,
            Math.round(birdY)
        );





        // CREATE PIPES

    if(gameRunning){


    if(

        pipes.length === 0 ||

        pipes[pipes.length-1].x <
        WIDTH - getPipeDistance()

    ){

        createPipe();

    }

}




        // MOVE PIPES

for(let p of pipes){


    p.x -= getPipeSpeed();



    // =====================
    // SCORE
    // =====================

    if(
        !p.passed &&
        p.x + PIPE_WIDTH < 80
    ){

        p.passed = true;


        score++;


        scoreText.setProperty(
            hmUI.prop.TEXT,
            "Score: " + score
        );

    }



    p.top.setProperty(
        hmUI.prop.X,
        Math.round(p.x)
    );



    p.bottom.setProperty(
        hmUI.prop.X,
        Math.round(p.x)
    );



}

// remove pipes that left screen

removeOldPipes();


// =====================
// COLLISION
// =====================

for(let p of pipes){


    let hitX =

        80 + 16 > p.x &&

        80 < p.x + PIPE_WIDTH;



    if(hitX){


        let hitTop =

            birdY < p.topHeight;



        let hitBottom =

            birdY + 16 > p.bottomY;



        if(hitTop || hitBottom){


            gameOver();


        }


    }


}



    },20);



}

});