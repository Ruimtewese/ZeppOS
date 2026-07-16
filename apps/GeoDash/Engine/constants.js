// =====================================================
// SCREEN SETTINGS
// =====================================================

// Width of the Bip 6 display
export const SCREEN_WIDTH = 390;

// Height of the Bip 6 display
export const SCREEN_HEIGHT = 450;


// =====================================================
// TILE SETTINGS
// =====================================================

// Width and height of one tile in pixels
export const TILE_SIZE = 40;


// =====================================================
// FLOOR SETTINGS
// =====================================================

// Height of the floor at the bottom of the screen
export const FLOOR_HEIGHT = 40;

// Y position where the floor begins
export const FLOOR_Y = SCREEN_HEIGHT - FLOOR_HEIGHT;


// =====================================================
// PLAYER SETTINGS
// =====================================================

// Width and height of the player image
export const PLAYER_SIZE = 40;

// Player starting X position
export const PLAYER_START_X = 80;

// Player starting Y position (standing on the floor)
export const PLAYER_START_Y = FLOOR_Y - PLAYER_SIZE;


// =====================================================
// PHYSICS SETTINGS
// =====================================================

// Downward acceleration added every frame
export const GRAVITY = 3;

// Upward velocity when jumping
export const JUMP_FORCE = -25;

// Automatic running speed (pixels per frame)
export const PLAYER_SPEED = 13;

// Maximum falling speed
export const MAX_FALL_SPEED = 18;


// =====================================================
// GAME SETTINGS
// =====================================================

// Time between game updates (16ms ≈ 60 FPS)
export const FRAME_TIME = 16;
// =====================================================
// DEBUG SETTINGS
// =====================================================

// Enable debug features
export const DEBUG_MODE = true;

// Automatically jump when the level starts
export const DEBUG_AUTO_JUMP = true;

// =====================================================
// IMAGE FILES
// =====================================================

// Sprite image names used throughout the game
export const SPRITES = {

    // Player cube
    player: "player1.png",

    // Solid block
    block: "block1.png",

    // Floor tile
    floor: "floor1.png",

    // Spike obstacle
    spike: "spike2.png",

    // Level background
    background: "background1.png"

};