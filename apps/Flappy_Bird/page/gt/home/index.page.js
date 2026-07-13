import * as hmUI from "@zos/ui";
import { onKey } from "@zos/interaction";
import { setInterval } from "@zos/timer";


// =====================
// SCREEN
// =====================

const WIDTH = 390;
const HEIGHT = 450;


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

let gameRunning = true;

// =====================
// CREATE PIPE
// =====================

function createPipe(){


    let gapY =
        Math.floor(
            Math.random() * 180
        ) + 150;



    let topHeight =
        gapY - PIPE_GAP / 2;



    let bottomY =
        gapY + PIPE_GAP / 2;



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

    bottom:bottom

});

}

function gameOver(){


    gameRunning = false;


    gameText.setProperty(
        hmUI.prop.TEXT,
        "GAME OVER\n\nPress Button"
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





    // =====================
    // DEBUG TEXT
    // =====================

    gameText =
    hmUI.createWidget(
        hmUI.widget.TEXT,
        {
            x:20,
            y:20,
            w:300,
            h:60,
            text:"READY",
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


        if(!gameRunning){


            birdY = 200;

            velocity = 0;

            gameRunning = true;


            gameText.setProperty(
                hmUI.prop.TEXT,
                "PLAYING"
            );


        }
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



     if(birdY > 430){

    gameOver();

}



        bird.setProperty(
            hmUI.prop.Y,
            Math.round(birdY)
        );





        // CREATE PIPES

        if(

            pipes.length === 0 ||

            pipes[pipes.length-1].x <
            WIDTH - PIPE_DISTANCE

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



}



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