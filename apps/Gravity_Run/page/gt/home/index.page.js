import * as hmUI from "@zos/ui";
import { setInterval } from "@zos/timer";


// =====================
// SCREEN SETTINGS
// =====================

// Size of the Amazfit Bip 6 screen
const WIDTH = 390;
const HEIGHT = 450;



// =====================
// PLAYER SETTINGS
// =====================

// Starting position of the player
let playerX = 220;
let playerY = 410;

// Size of the green player square
const playerSize = 20;


// Current vertical movement speed
let velocityY = 0;


// Gravity strength
// Higher value = faster falling
const gravity = 0.8;


// Force applied when gravity switches
// Higher value = faster flip
const flipForce = 9;


// 1 = normal gravity (down)
// -1 = reversed gravity (up)
let gravityDirection = 1;



// =====================
// GRAVITY COOLDOWN
// =====================

// Prevents the player from switching gravity repeatedly in mid-air
let gravityCooldown = 0;


// Time before gravity can switch again (milliseconds)
const gravityCooldownTime = 500;



// Stores the player graphic object
let player;



// =====================
// DIFFICULTY SETTINGS
// =====================

// Maximum speed the game can reach
// Stops the game becoming impossible
const maxSpeed = 12;




// =====================
// PLATFORM SETTINGS
// =====================

// Position where the player lands on the floor
const floorY = 410;


// Position where the player lands on the ceiling
const ceilingY = 20;


// Stores the yellow platform graphics
let floorPlatform;
let ceilingPlatform;




// =====================
// OBSTACLE SETTINGS
// =====================

// Array containing all active obstacles
let obstacles = [];


// Number of obstacles active in the game
const obstacleCount = 15;


// Width of every red obstacle
const obstacleWidth = 30;


// Minimum distance between obstacles
const minObstacleSpacing = 150;


// Maximum distance between obstacles
const maxObstacleSpacing = 400;





// =====================
// GAME VARIABLES
// =====================

// Current score
let score = 0;


// Text displaying score
let scoreText;


// Text displaying game over message
let gameText;


// Controls if the game is running
let gameRunning = true;





// =====================
// MAIN APP START
// =====================

Page({

build(){


    // Removes the default watch status bar
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
// TOUCH CONTROL
// =====================

hmUI.createWidget(
hmUI.widget.BUTTON,
{
x:0,
y:0,
w:WIDTH,
h:HEIGHT,

text:"",

normal_color:0x000000,
press_color:0x000000,

alpha:0,


click_func(){


if(gameRunning){


if(gravityCooldown <= 0){


gravityDirection *= -1;


velocityY =
flipForce * gravityDirection;


gravityCooldown =
gravityCooldownTime;


}


}
else{


restart();


}


}

}
);






// =====================
// PLAYER
// =====================

player = hmUI.createWidget(
hmUI.widget.FILL_RECT,
{
x:playerX,
y:playerY,
w:playerSize,
h:playerSize,
color:0x00ff00
}
);


let gameSpeed =
Math.min(maxSpeed, 5 + score * 0.05);



// =====================
// FLOOR PLATFORM
// =====================

floorPlatform = hmUI.createWidget(
hmUI.widget.FILL_RECT,
{
x:0,
y:430,
w:WIDTH,
h:20,
color:0xffff00
}
);






// =====================
// CEILING PLATFORM
// =====================

ceilingPlatform = hmUI.createWidget(
hmUI.widget.FILL_RECT,
{
x:0,
y:0,
w:WIDTH,
h:20,
color:0xffff00
}
);






// =====================
// CREATE OBSTACLES
// =====================

for(let i=0;i<obstacleCount;i++){


createObstacle(
WIDTH + i * 250
);


}






// =====================
// SCORE
// =====================

scoreText = hmUI.createWidget(
hmUI.widget.TEXT,
{
x:10,
y:40,
w:200,
h:40,
text:"Score: 0",
text_size:25,
color:0xffffff
}
);






// =====================
// GAME OVER TEXT
// =====================

gameText = hmUI.createWidget(
hmUI.widget.TEXT,
{
x:80,
y:200,
w:250,
h:60,
text:"",
text_size:30,
color:0xffffff
}
);



startGame();


}

});

// =====================
// CREATE RANDOM OBSTACLE
// =====================

function createObstacle(x){


let height =
50 + Math.random() * 120;


let fromTop =
Math.random() > 0.5;


let y;


if(fromTop){


y = 20;


}
else{


y = 430 - height;


}





let widget = hmUI.createWidget(
hmUI.widget.FILL_RECT,
{
x:x,
y:y,
w:obstacleWidth,
h:height,
color:0xff0000
}
);





obstacles.push({

widget:widget,

x:x,

y:y,

height:height

});


}


// =====================
// GAME LOOP
// =====================

function startGame(){


setInterval(()=>{


if(!gameRunning){

return;

}





// =====================
// COOLDOWN TIMER
// =====================

if(gravityCooldown > 0){


gravityCooldown -= 20;


}






// =====================
// GRAVITY
// =====================

velocityY += gravity * gravityDirection;

playerY += velocityY;






// =====================
// PLATFORM COLLISION
// =====================

if(playerY >= floorY){


playerY = floorY;

velocityY = 0;


gravityCooldown = 0;


}





if(playerY <= ceilingY){


playerY = ceilingY;

velocityY = 0;


gravityCooldown = 0;


}








// =====================
// MOVE OBSTACLES
// =====================

for(let i=0;i<obstacles.length;i++){


let obs = obstacles[i];



let gameSpeed = 5 + score * 0.05;

obs.x -= gameSpeed;






// =====================
// RESET OBSTACLE
// =====================

if(obs.x < -obstacleWidth){



let furthest = 0;



for(let j=0;j<obstacles.length;j++){


if(obstacles[j].x > furthest){


furthest = obstacles[j].x;


}


}






let currentMinSpacing =
Math.max(80, minObstacleSpacing - score * 2);

let currentMaxSpacing =
Math.max(150, maxObstacleSpacing - score * 2);


obs.x =
furthest +
currentMinSpacing +
Math.random() *
(currentMaxSpacing-currentMinSpacing);







let maxHeight =
120 + score * 0.5;


obs.height =
50 + Math.random()*(maxHeight-50);





if(Math.random() > 0.5){


obs.y = 20;


}
else{


obs.y = 430 - obs.height;


}







score++;


scoreText.setProperty(
hmUI.prop.TEXT,
"Score: " + score
);


}









// =====================
// OBSTACLE COLLISION
// =====================

if(

playerX + playerSize > obs.x &&

playerX < obs.x + obstacleWidth &&

playerY + playerSize > obs.y &&

playerY < obs.y + obs.height

){



playerX -= 25;



}







// UPDATE OBSTACLE DISPLAY

obs.widget.setProperty(
hmUI.prop.X,
obs.x
);


obs.widget.setProperty(
hmUI.prop.Y,
obs.y
);


obs.widget.setProperty(
hmUI.prop.H,
obs.height
);



}








// =====================
// UPDATE PLAYER
// =====================

player.setProperty(
hmUI.prop.X,
playerX
);


player.setProperty(
hmUI.prop.Y,
playerY
);









// =====================
// DEATH
// =====================

if(

playerX < -20 ||

playerY < -10 ||

playerY > 430

){


gameOver();


}




},20);


}



// =====================
// GAME OVER
// =====================

function gameOver(){


gameRunning = false;


gameText.setProperty(
hmUI.prop.TEXT,
"GAME OVER\nTap"
);


}








// =====================
// RESTART
// =====================

function restart(){


playerX = 220;

playerY = 410;


velocityY = 0;


gravityDirection = 1;


gravityCooldown = 0;


score = 0;





scoreText.setProperty(
hmUI.prop.TEXT,
"Score: 0"
);





gameText.setProperty(
hmUI.prop.TEXT,
""
);






for(let i=0;i<obstacles.length;i++){



obstacles[i].x =
WIDTH + i * 250;



obstacles[i].height =
50 + Math.random()*120;



if(Math.random()>0.5){


obstacles[i].y = 20;


}
else{


obstacles[i].y = 430 - obstacles[i].height;


}



obstacles[i].widget.setProperty(
hmUI.prop.X,
obstacles[i].x
);


obstacles[i].widget.setProperty(
hmUI.prop.Y,
obstacles[i].y
);


obstacles[i].widget.setProperty(
hmUI.prop.H,
obstacles[i].height
);



}



gameRunning = true;


}