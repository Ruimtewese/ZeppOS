import * as hmUI from "@zos/ui";
import { setInterval } from "@zos/timer";
import { onKey } from "@zos/interaction";
import { 
    Vibrator,
    VIBRATOR_SCENE_SHORT_LIGHT
} from "@zos/sensor";

// ======================================================
// SCREEN
// ======================================================

const WIDTH = 390;
const HEIGHT = 450;

// ======================================================
// PLAYER
// ======================================================

// Starting position
let playerX = 90;
let playerY = 410;

// Player size
const PLAYER_SIZE = 18;

// Physics
let velocityY = 0;
let gravityDirection = 1;

const GRAVITY = 0.8;
const FLIP_FORCE = 9;

// Player widget
let player;

// Vibration motor
const vibrator = new Vibrator();

// ======================================================
// PLATFORMS
// ======================================================

const FLOOR_Y = 410;
const CEILING_Y = 20;

let floorPlatform;
let ceilingPlatform;

// ======================================================
// GRAVITY COOLDOWN
// ======================================================

let gravityCooldown = 0;
const GRAVITY_COOLDOWN = 300;

// ======================================================
// OBSTACLES
// ======================================================

let obstacles = [];

// Number of active obstacles
const OBSTACLE_COUNT = 15;

// Width of every obstacle
const OBSTACLE_WIDTH = 30;

// Difficulty settings
const START_SPEED = 5;
const MAX_SPEED = 12;

const START_MIN_SPACING = 180;
const START_MAX_SPACING = 420;

const MIN_SPACING_LIMIT = 120;
const MAX_SPACING_LIMIT = 250;

const START_MIN_HEIGHT = 50;
const START_MAX_HEIGHT = 120;
const MAX_HEIGHT_LIMIT = 220;

// ======================================================
// GAME
// ======================================================

let score = 0;

let scoreText;
let gameText;

let gameRunning = true;

// ======================================================
// GAME FUNCTIONS
// ======================================================

// Current obstacle speed
function getGameSpeed() {

    return Math.min(
        MAX_SPEED,
        START_SPEED + score * 0.05
    );

}

// Current minimum spacing
function getMinSpacing() {

    return Math.max(
        MIN_SPACING_LIMIT,
        START_MIN_SPACING - score * 2
    );

}

// Current maximum spacing
function getMaxSpacing() {

    return Math.max(
        MAX_SPACING_LIMIT,
        START_MAX_SPACING - score * 2
    );

}

// Current maximum obstacle height
function getMaxObstacleHeight() {

    return Math.min(
        MAX_HEIGHT_LIMIT,
        START_MAX_HEIGHT + score * 0.5
    );

}

// ======================================================
// MAIN PAGE
// ======================================================

Page({

build() {

    // Hide the system status bar
    hmUI.setStatusBarVisible(false);

    // ==================================================
    // BACKGROUND
    // ==================================================

    hmUI.createWidget(
        hmUI.widget.FILL_RECT,
        {
            x: 0,
            y: 0,
            w: WIDTH,
            h: HEIGHT,
            color: 0x000000
        }
    );

    // ==================================================
    // PLAYER
    // ==================================================

    player = hmUI.createWidget(
        hmUI.widget.FILL_RECT,
        {
            x: playerX,
            y: playerY,
            w: PLAYER_SIZE,
            h: PLAYER_SIZE,
            color: 0x00FF00
        }
    );

    // ==================================================
    // CEILING PLATFORM
    // ==================================================

    ceilingPlatform = hmUI.createWidget(
        hmUI.widget.FILL_RECT,
        {
            x: 0,
            y: 0,
            w: WIDTH,
            h: 20,
            color: 0xFFFF00
        }
    );

    // ==================================================
    // FLOOR PLATFORM
    // ==================================================

    floorPlatform = hmUI.createWidget(
        hmUI.widget.FILL_RECT,
        {
            x: 0,
            y: 430,
            w: WIDTH,
            h: 20,
            color: 0xFFFF00
        }
    );

    // ==================================================
    // SCORE
    // ==================================================

    scoreText = hmUI.createWidget(
        hmUI.widget.TEXT,
        {
            x: 10,
            y: 40,
            w: 200,
            h: 40,
            text: "Score: 0",
            text_size: 24,
            color: 0xFFFFFF
        }
    );

    // ==================================================
    // GAME OVER TEXT
    // ==================================================

    gameText = hmUI.createWidget(
        hmUI.widget.TEXT,
        {
            x: 60,
            y: 185,
            w: 280,
            h: 80,
            text: "",
            text_size: 30,
            color: 0xFFFFFF
        }
    );

    // ==================================================
    // CREATE OBSTACLES
    // ==================================================

    let nextX = WIDTH + 150;

    for (let i = 0; i < OBSTACLE_COUNT; i++) {

        createObstacle(nextX);

        nextX +=
            START_MIN_SPACING +
            Math.random() *
            (START_MAX_SPACING - START_MIN_SPACING);

    }

    // ==================================================
    // PHYSICAL BUTTONS
    // ==================================================

// =====================
// PHYSICAL BUTTON CONTROL
// =====================

onKey({

    callback:(key,event)=>{

if(key === 36 && event === 1){


    if(gameRunning){


        if(gravityCooldown <= 0){


            gravityDirection *= -1;


            velocityY =
            FLIP_FORCE * gravityDirection;


            gravityCooldown =
            GRAVITY_COOLDOWN;



        }


    }


}



        if(key === 93 && event === 1){


            if(!gameRunning){


                restart();


            }


        }



        return true;


    }

});


    // ==================================================
    // START GAME
    // ==================================================

    startGame();

}

});


// ======================================================
// CREATE OBSTACLE
// ======================================================

function createObstacle(x) {

    // Random height
    let height =
        START_MIN_HEIGHT +
        Math.random() *
        (START_MAX_HEIGHT - START_MIN_HEIGHT);

    // Random side
    let fromTop = Math.random() > 0.5;

    let y;

    if (fromTop) {

        y = 20;

    } else {

        y = 430 - height;

    }

    // Create obstacle widget
    let widget = hmUI.createWidget(
        hmUI.widget.FILL_RECT,
        {
            x: x,
            y: y,
            w: OBSTACLE_WIDTH,
            h: height,
            color: 0xFF0000
        }
    );

    obstacles.push({

        widget: widget,

        x: x,

        y: y,

        height: height,

        fromTop: fromTop

    });

}

// ======================================================
// RESPAWN OBSTACLE
// ======================================================

function respawnObstacle(obstacle) {

    // Find the obstacle furthest to the right
    let furthestX = WIDTH;

    for (let i = 0; i < obstacles.length; i++) {

        if (obstacles[i].x > furthestX) {

            furthestX = obstacles[i].x;

        }

    }

    // New spacing based on difficulty
    obstacle.x =
        furthestX +
        getMinSpacing() +
        Math.random() *
        (getMaxSpacing() - getMinSpacing());

    // New random height
    obstacle.height =
        START_MIN_HEIGHT +
        Math.random() *
        (getMaxObstacleHeight() - START_MIN_HEIGHT);

    // Randomly choose ceiling or floor
    obstacle.fromTop = Math.random() > 0.5;

    if (obstacle.fromTop) {

        obstacle.y = 20;

    } else {

        obstacle.y = 430 - obstacle.height;

    }

    // Update widget
    obstacle.widget.setProperty(
        hmUI.prop.X,
        obstacle.x
    );

    obstacle.widget.setProperty(
        hmUI.prop.Y,
        obstacle.y
    );

    obstacle.widget.setProperty(
        hmUI.prop.H,
        obstacle.height
    );

    // Increase score
    score++;

    scoreText.setProperty(
        hmUI.prop.TEXT,
        "Score: " + score
    );

}



// ======================================================
// GAME LOOP
// ======================================================

function startGame() {

    setInterval(() => {

        if (!gameRunning) {
            return;
        }

        // ===============================================
        // UPDATE COOLDOWN
        // ===============================================

        gravityCooldown = Math.max(
            0,
            gravityCooldown - 20
        );

        // ===============================================
        // APPLY GRAVITY
        // ===============================================

        velocityY +=
            GRAVITY * gravityDirection;

        playerY += velocityY;

        // ===============================================
        // PLATFORM COLLISION
        // ===============================================

        if (gravityDirection > 0) {

            if (playerY >= FLOOR_Y) {

                playerY = FLOOR_Y;
                velocityY = 0;
                gravityCooldown = 0;

            }

        } else {

            if (playerY <= CEILING_Y) {

                playerY = CEILING_Y;
                velocityY = 0;
                gravityCooldown = 0;

            }

        }

        // ===============================================
        // MOVE PLAYER
        // ===============================================

        player.setProperty(
            hmUI.prop.X,
            playerX
        );

        player.setProperty(
            hmUI.prop.Y,
            playerY
        );

        // ===============================================
        // CURRENT GAME SPEED
        // ===============================================

        const speed =
            getGameSpeed();

        // ===============================================
        // UPDATE OBSTACLES
        // ===============================================

        for (let i = 0; i < obstacles.length; i++) {

            let obs = obstacles[i];

            // Move obstacle left
            obs.x -= speed;

            // Respawn obstacle
            if (obs.x < -OBSTACLE_WIDTH) {

                respawnObstacle(obs);

            }

            // Collision
            if (

                playerX + PLAYER_SIZE > obs.x &&
                playerX < obs.x + OBSTACLE_WIDTH &&
                playerY + PLAYER_SIZE > obs.y &&
                playerY < obs.y + obs.height

            ) {

                playerX = Math.max(
                    -30,
                    playerX - 25
                );

            }

            // Update widget

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

        // ===============================================
        // DEATH
        // ===============================================

        if (

            playerX <= -PLAYER_SIZE ||
            playerY < -10 ||
            playerY > 430

        ) {

            gameOver();

        }

    }, 20);

}


// ======================================================
// GAME OVER
// ======================================================

function gameOver() {

    gameRunning = false;

    gameText.setProperty(
        hmUI.prop.TEXT,
        "GAME OVER\n\nBottom Button\nRestart"
    );

}


// ======================================================
// RESTART
// ======================================================

function restart() {

    // -----------------------------
    // Reset game state
    // -----------------------------

    gameRunning = true;

    score = 0;

    gravityDirection = 1;

    gravityCooldown = 0;

    velocityY = 0;

    playerX = 90;
    playerY = FLOOR_Y;

    // -----------------------------
    // Update UI
    // -----------------------------

    scoreText.setProperty(
        hmUI.prop.TEXT,
        "Score: 0"
    );

    gameText.setProperty(
        hmUI.prop.TEXT,
        ""
    );

    player.setProperty(
        hmUI.prop.X,
        playerX
    );

    player.setProperty(
        hmUI.prop.Y,
        playerY
    );

    // -----------------------------
    // Respawn obstacles
    // -----------------------------

    let nextX = WIDTH + 150;

    for (let i = 0; i < obstacles.length; i++) {

        let obs = obstacles[i];

        obs.height =
            START_MIN_HEIGHT +
            Math.random() *
            (START_MAX_HEIGHT - START_MIN_HEIGHT);

        obs.fromTop =
            Math.random() > 0.5;

        if (obs.fromTop) {

            obs.y = 20;

        } else {

            obs.y =
                430 - obs.height;

        }

        obs.x = nextX;

        nextX +=
            START_MIN_SPACING +
            Math.random() *
            (START_MAX_SPACING - START_MIN_SPACING);

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

}