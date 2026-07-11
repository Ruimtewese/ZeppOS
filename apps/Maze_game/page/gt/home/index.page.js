import * as hmUI from "@zos/ui";
import { Accelerometer, Vibrator, VIBRATOR_SCENE_SHORT_STRONG } from "@zos/sensor";

const accel = new Accelerometer();
const vibrator = new Vibrator();

let player;

let mazeWidgets = [];

let complete = false;

let completionBg;
let completionText;
let newMazeButton;


// =================
// COLORS
// =================

const WALL_COLOR = 0xffffff;
const PLAYER_COLOR = 0xffff00;
const START_COLOR = 0x00ff00;
const FINISH_COLOR = 0xff0000;


// =================
// SCREEN
// =================

const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 450;

const COMPLETION_BG_COLOR = 0x101820;
const COMPLETION_TEXT_COLOR = 0xffffff;
const COMPLETION_BUTTON_COLOR = 0x0033aa;
const COMPLETION_BUTTON_PRESS_COLOR = 0x0055dd;


// =================
// MAZE
// =================

const CELL = 15;

const COLS = 25;
const ROWS = 29;


const OFFSET_X =
  Math.floor(
    (SCREEN_WIDTH - COLS * CELL) / 2
  );


const OFFSET_Y =
  Math.floor(
    (SCREEN_HEIGHT - ROWS * CELL) / 2
  );


const START_X = 1;
const START_Y = 1;

const END_X = COLS - 2;
const END_Y = ROWS - 2;



let maze = [];


// =================
// PLAYER
// =================

const PLAYER_SIZE = 10;

let playerX;
let playerY;

const SPEED = 0.03;



// =================
// MAZE GENERATION
// =================

function createMaze(){

  maze = [];


  for(let y=0;y<ROWS;y++){

    maze[y]=[];

    for(let x=0;x<COLS;x++){

      maze[y][x]=1;

    }

  }

}



function generate(x,y){

  maze[y][x]=0;


  let dirs=[
    [2,0],
    [-2,0],
    [0,2],
    [0,-2]
  ];


  dirs.sort(
    ()=>Math.random()-0.5
  );


  for(let d of dirs){

    let nx=x+d[0];
    let ny=y+d[1];


    if(
      nx>0 &&
      ny>0 &&
      nx<COLS-1 &&
      ny<ROWS-1 &&
      maze[ny][nx]==1
    ){

      maze[y+d[1]/2][x+d[0]/2]=0;

      generate(nx,ny);

    }

  }

}



// =================
// DRAW MAZE
// =================

function drawMaze(){

  for(let y=0;y<ROWS;y++){

    for(let x=0;x<COLS;x++){


      if(maze[y][x]==1){


        let wall =
        hmUI.createWidget(
          hmUI.widget.FILL_RECT,
          {
            x:x*CELL+OFFSET_X,
            y:y*CELL+OFFSET_Y,
            w:CELL,
            h:CELL,
            color:WALL_COLOR
          }
        );


        mazeWidgets.push(wall);

      }

    }

  }

}



function drawPoints(){


  let start =
  hmUI.createWidget(
    hmUI.widget.FILL_RECT,
    {
      x:START_X*CELL+OFFSET_X+3,
      y:START_Y*CELL+OFFSET_Y+3,
      w:CELL-6,
      h:CELL-6,
      color:START_COLOR
    }
  );


  mazeWidgets.push(start);



  let finish =
  hmUI.createWidget(
    hmUI.widget.FILL_RECT,
    {
      x:END_X*CELL+OFFSET_X+3,
      y:END_Y*CELL+OFFSET_Y+3,
      w:CELL-6,
      h:CELL-6,
      color:FINISH_COLOR
    }
  );


  mazeWidgets.push(finish);

}



// =================
// COLLISION
// =================

function canMove(x,y){


  let left =
    Math.floor(
      (x-OFFSET_X)/CELL
    );


  let right =
    Math.floor(
      (x+PLAYER_SIZE-OFFSET_X)/CELL
    );


  let top =
    Math.floor(
      (y-OFFSET_Y)/CELL
    );


  let bottom =
    Math.floor(
      (y+PLAYER_SIZE-OFFSET_Y)/CELL
    );



  for(
    let yy=top;
    yy<=bottom;
    yy++
  ){

    for(
      let xx=left;
      xx<=right;
      xx++
    ){


      if(
        xx<0 ||
        yy<0 ||
        xx>=COLS ||
        yy>=ROWS
      ){

        return false;

      }


      if(
        maze[yy][xx]==1
      ){

        return false;

      }


    }

  }


  return true;

}



// =================
// MOVEMENT (ORIGINAL)
// =================

function move(dx,dy){


  let steps=Math.ceil(
    Math.max(
      Math.abs(dx),
      Math.abs(dy)
    )
  );


  if(steps<1)
    steps=1;



  dx/=steps;
  dy/=steps;



  for(
    let i=0;
    i<steps;
    i++
  ){


    if(
      canMove(
        playerX+dx,
        playerY
      )
    ){

      playerX+=dx;

    }



    if(
      canMove(
        playerX,
        playerY+dy
      )
    ){

      playerY+=dy;

    }


  }


}



// =================
// FINISH CHECK
// =================

function clearMazeWidgets(){

  for(
    let i=0;
    i<mazeWidgets.length;
    i++
  ){

    mazeWidgets[i].setProperty(
      hmUI.prop.X,
      -500
    );

    mazeWidgets[i].setProperty(
      hmUI.prop.Y,
      -500
    );

  }

  mazeWidgets = [];

}


function hideCompletionScreen(){

  if(completionBg){
    completionBg.setProperty(
      hmUI.prop.X,
      -500
    );

    completionBg.setProperty(
      hmUI.prop.Y,
      -500
    );
  }

  if(completionText){
    completionText.setProperty(
      hmUI.prop.X,
      -500
    );

    completionText.setProperty(
      hmUI.prop.Y,
      -500
    );
  }

  if(newMazeButton){
    newMazeButton.setProperty(
      hmUI.prop.X,
      -500
    );

    newMazeButton.setProperty(
      hmUI.prop.Y,
      -500
    );
  }

}


function vibrateComplete(){

  vibrator.setMode(VIBRATOR_SCENE_SHORT_STRONG);
  vibrator.start();

}


function showCompletionScreen(){

  if(!completionBg || !completionText || !newMazeButton)
    return;


  completionBg.setProperty(
    hmUI.prop.X,
    0
  );

  completionBg.setProperty(
    hmUI.prop.Y,
    0
  );

  completionBg.setProperty(
    hmUI.prop.W,
    SCREEN_WIDTH
  );

  completionBg.setProperty(
    hmUI.prop.H,
    SCREEN_HEIGHT
  );


  completionText.setProperty(
    hmUI.prop.X,
    100
  );

  completionText.setProperty(
    hmUI.prop.Y,
    175
  );


  newMazeButton.setProperty(
    hmUI.prop.X,
    95
  );

  newMazeButton.setProperty(
    hmUI.prop.Y,
    215
  );

}


function resetMaze(){

  complete = false;

  hideCompletionScreen();

  clearMazeWidgets();

  createMaze();

  generate(
    START_X,
    START_Y
  );

  drawMaze();

  drawPoints();


  playerX =
    START_X*CELL+OFFSET_X+3;


  playerY =
    START_Y*CELL+OFFSET_Y+3;


  player.setProperty(
    hmUI.prop.X,
    Math.round(playerX)
  );

  player.setProperty(
    hmUI.prop.Y,
    Math.round(playerY)
  );

}


function checkFinish(){


  let fx =
    END_X*CELL+OFFSET_X;


  let fy =
    END_Y*CELL+OFFSET_Y;



  if(
    playerX < fx+CELL &&
    playerX+PLAYER_SIZE > fx &&
    playerY < fy+CELL &&
    playerY+PLAYER_SIZE > fy
  ){

    complete=true;

    clearMazeWidgets();
    showCompletionScreen();
    vibrateComplete();

    console.log("COMPLETE");

  }

}



// =================
// START
// =================

Page({

build(){


  hmUI.setStatusBarVisible(false);



  createMaze();


  generate(
    START_X,
    START_Y
  );


  drawMaze();

  drawPoints();



  playerX =
    START_X*CELL+OFFSET_X+3;


  playerY =
    START_Y*CELL+OFFSET_Y+3;



  player =
    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x:playerX,
        y:playerY,
        w:PLAYER_SIZE,
        h:PLAYER_SIZE,
        color:PLAYER_COLOR
      }
    );



  completionBg =
    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x:-500,
        y:-500,
        w:SCREEN_WIDTH,
        h:SCREEN_HEIGHT,
        color:COMPLETION_BG_COLOR
      }
    );


  completionText =
    hmUI.createWidget(
      hmUI.widget.TEXT,
      {
        x:-500,
        y:-500,
        w:200,
        h:40,
        color:COMPLETION_TEXT_COLOR,
        text:"Complete",
        text_size:26,
        align_h:hmUI.align.CENTER_H,
        align_v:hmUI.align.CENTER_V
      }
    );


  newMazeButton =
    hmUI.createWidget(
      hmUI.widget.BUTTON,
      {
        x:-500,
        y:-500,
        w:200,
        h:40,
        radius:8,
        normal_color:COMPLETION_BUTTON_COLOR,
        press_color:COMPLETION_BUTTON_PRESS_COLOR,
        text:"New Maze",
        text_size:22,
        click_func:resetMaze
      }
    );


  hideCompletionScreen();


  accel.onChange(()=>{


    if(complete)
      return;



    const data =
      accel.getCurrent();



    const x =
      Math.round(data.x);


    const y =
      Math.round(data.y);



    move(
      -x*SPEED,
      y*SPEED
    );



    player.setProperty(
      hmUI.prop.X,
      Math.round(playerX)
    );


    player.setProperty(
      hmUI.prop.Y,
      Math.round(playerY)
    );



    checkFinish();


  });



  accel.start();


}

});