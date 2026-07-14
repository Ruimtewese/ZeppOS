import * as hmUI from "@zos/ui";
import { onKey } from "@zos/interaction";
import { setInterval } from "@zos/timer";


// =====================
// SCREEN
// =====================

const WIDTH = 480;
const HEIGHT = 480;



// =====================
// PLAYER
// =====================

const PLAYER_BASE_SIZE = 45;

const PLAYER_SCALE = 1.0;

const PLAYER_SIZE = PLAYER_BASE_SIZE * PLAYER_SCALE;


const PLAYER_X = 100;


let playerY;

let velocityY = 0;


let player;



// =====================
// PHYSICS
// =====================

const GRAVITY = 0.5;

const JUMP_FORCE = -10;


const FLOOR_Y = 430;



// =====================
// SPIKES
// =====================

let spikes = [];


// Spike image size

const SPIKE_BASE_WIDTH = 170;
const SPIKE_BASE_HEIGHT = 90;


const SPIKE_SCALE = 0.5;


const SPIKE_WIDTH = SPIKE_BASE_WIDTH * SPIKE_SCALE;
const SPIKE_HEIGHT = SPIKE_BASE_HEIGHT * SPIKE_SCALE;


const SPIKE_Y = FLOOR_Y - SPIKE_HEIGHT;


const SPIKE_SPEED = 5;


// Distance between spikes in a group

const SPIKE_GAP = 0.55;



let spawnTimer = 0;




// =====================
// CREATE SPIKE
// =====================

function createSpike(x){


  let img = hmUI.createWidget(
    hmUI.widget.IMG,
    {
      x:x,

      y:SPIKE_Y,

      w:SPIKE_WIDTH,
      h:SPIKE_HEIGHT,

      src:"image3.png"
    }
  );


  spikes.push({

    widget:img,

    x:x

  });


}




// =====================
// CREATE SPIKE GROUP
// =====================

function spawnSpikeGroup(){


  let amount = Math.floor(Math.random()*3)+1;


  let startX = WIDTH + 50;



  for(let i=0;i<amount;i++){


    createSpike(
      startX + i * (SPIKE_WIDTH * SPIKE_GAP)
    );


  }


}




// =====================
// COLLISION
// =====================

function checkCollision(){


  for(let i=0;i<spikes.length;i++){


    let s = spikes[i];



    if(

      PLAYER_X < s.x + SPIKE_WIDTH &&

      PLAYER_X + PLAYER_SIZE > s.x &&

      playerY < SPIKE_Y + SPIKE_HEIGHT &&

      playerY + PLAYER_SIZE > SPIKE_Y

    ){


      return true;


    }


  }



  return false;


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
    color:0x000000
  }
);



// =====================
// FLOOR
// =====================

hmUI.createWidget(
  hmUI.widget.FILL_RECT,
  {
    x:0,
    y:FLOOR_Y,
    w:WIDTH,
    h:50,
    color:0xffffff
  }
);



// =====================
// PLAYER
// =====================

playerY = FLOOR_Y - PLAYER_SIZE;


player = hmUI.createWidget(
  hmUI.widget.FILL_RECT,
  {
    x:PLAYER_X,

    y:playerY,

    w:PLAYER_SIZE,

    h:PLAYER_SIZE,

    color:0x00ff00,

    radius:8
  }
);





// =====================
// JUMP
// =====================

onKey({

callback:(key,event)=>{


if(event === 1 && key === 36){


if(playerY >= FLOOR_Y - PLAYER_SIZE){


velocityY = JUMP_FORCE;


}


}


return true;


}


});






// =====================
// GAME LOOP
// =====================

setInterval(()=>{



// PLAYER MOVEMENT

velocityY += GRAVITY;

playerY += velocityY;



if(playerY > FLOOR_Y - PLAYER_SIZE){


playerY = FLOOR_Y - PLAYER_SIZE;

velocityY = 0;


}



player.setProperty(
  hmUI.prop.Y,
  playerY
);





// =====================
// SPIKE MOVEMENT
// =====================

for(let i = spikes.length - 1; i >= 0; i--){


spikes[i].x -= SPIKE_SPEED;



spikes[i].widget.setProperty(
  hmUI.prop.X,
  spikes[i].x
);



if(spikes[i].x < -SPIKE_WIDTH){


spikes[i].widget.setProperty(
  hmUI.prop.VISIBLE,
  false
);



spikes.splice(i,1);


}


}





// =====================
// SPAWN SPIKES
// =====================

spawnTimer++;



if(spawnTimer > 120){


spawnSpikeGroup();


spawnTimer = 0;


}





// =====================
// COLLISION TEST
// =====================

if(checkCollision()){


console.log("HIT");


playerY = 80;


velocityY = 0;



player.setProperty(
  hmUI.prop.Y,
  playerY
);


}



},16);



}


});