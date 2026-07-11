import * as hmUI from "@zos/ui";
import { Accelerometer } from "@zos/sensor";

const accel = new Accelerometer();

let player;


// Screen
const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 450;


// Maze
const CELL = 15;

const COLS = 25;
const ROWS = 29;

const MAZE_WIDTH = COLS * CELL;
const MAZE_HEIGHT = ROWS * CELL;


// Center maze
const OFFSET_X = Math.floor((SCREEN_WIDTH - MAZE_WIDTH) / 2);
const OFFSET_Y = Math.floor((SCREEN_HEIGHT - MAZE_HEIGHT) / 2);


// Player
const PLAYER_SIZE = 10;

let playerX = OFFSET_X + CELL + 2;
let playerY = OFFSET_Y + CELL + 2;

const speed = 0.02;


// Maze array
let maze = [];


// Start and finish (must be odd coordinates)
const START_X = 1;
const START_Y = 1;

const FINISH_X = COLS - 2;
const FINISH_Y = ROWS - 2;



// Create walls
function createMaze(){

  for(let y = 0; y < ROWS; y++){

    maze[y] = [];

    for(let x = 0; x < COLS; x++){

      maze[y][x] = 1;

    }

  }

}



// Recursive backtracking
function carve(x,y){

  maze[y][x] = 0;


  let directions = [
    [2,0],
    [-2,0],
    [0,2],
    [0,-2]
  ];


  // Randomize directions
  directions.sort(
    () => Math.random() - 0.5
  );


  for(let i = 0; i < directions.length; i++){

    const nx = x + directions[i][0];
    const ny = y + directions[i][1];


    if(
      nx > 0 &&
      ny > 0 &&
      nx < COLS - 1 &&
      ny < ROWS - 1 &&
      maze[ny][nx] === 1
    ){

      // Remove wall between cells
      maze[
        y + directions[i][1] / 2
      ][
        x + directions[i][0] / 2
      ] = 0;


      carve(nx, ny);

    }

  }

}



// Draw walls
function drawMaze(){

  for(let y = 0; y < ROWS; y++){

    for(let x = 0; x < COLS; x++){


      if(maze[y][x] === 1){

        hmUI.createWidget(
          hmUI.widget.FILL_RECT,
          {
            x:x * CELL + OFFSET_X,
            y:y * CELL + OFFSET_Y,
            w:CELL,
            h:CELL,
            color:0xffffff
          }
        );

      }

    }

  }

}



// Draw start and finish
function drawPoints(){


  // Start green

  hmUI.createWidget(
    hmUI.widget.FILL_RECT,
    {
      x:START_X * CELL + OFFSET_X + 3,
      y:START_Y * CELL + OFFSET_Y + 3,
      w:CELL - 6,
      h:CELL - 6,
      color:0x00ff00
    }
  );



  // Finish red

  hmUI.createWidget(
    hmUI.widget.FILL_RECT,
    {
      x:FINISH_X * CELL + OFFSET_X + 3,
      y:FINISH_Y * CELL + OFFSET_Y + 3,
      w:CELL - 6,
      h:CELL - 6,
      color:0xff0000
    }
  );

}



Page({

  build(){


    hmUI.setStatusBarVisible(false);



    // Generate maze

    createMaze();

    carve(
      START_X,
      START_Y
    );



    drawMaze();

    drawPoints();



    // Player

    player = hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x:playerX,
        y:playerY,
        w:PLAYER_SIZE,
        h:PLAYER_SIZE,
        color:0x0000ff
      }
    );



    // Accelerometer movement

    accel.onChange(()=>{


      const data = accel.getCurrent();


      const x = Math.round(data.x);
      const y = Math.round(data.y);



      // Your corrected axis

      playerX -= x * speed;
      playerY += y * speed;



      // Keep player in maze area

      const minX = OFFSET_X;
      const maxX = OFFSET_X + MAZE_WIDTH - PLAYER_SIZE;

      const minY = OFFSET_Y;
      const maxY = OFFSET_Y + MAZE_HEIGHT - PLAYER_SIZE;



      playerX = Math.max(
        minX,
        Math.min(maxX, playerX)
      );


      playerY = Math.max(
        minY,
        Math.min(maxY, playerY)
      );



      player.setProperty(
        hmUI.prop.X,
        Math.round(playerX)
      );


      player.setProperty(
        hmUI.prop.Y,
        Math.round(playerY)
      );


    });



    accel.start();


  }

});