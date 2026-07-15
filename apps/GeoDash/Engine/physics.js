import {
    GRAVITY,
    JUMP_FORCE,
    PLAYER_SPEED,
    MAX_FALL_SPEED
} from "./constants.js";

export class Physics {

    update(player) {

        // Save previous position
        player.previousX = player.x;
        player.previousY = player.y;

        // Auto run
        player.x += PLAYER_SPEED;

        // Gravity
        player.velocityY += GRAVITY;

        if (player.velocityY > MAX_FALL_SPEED) {
            player.velocityY = MAX_FALL_SPEED;
        }

        // Vertical movement
        player.y += player.velocityY;

    }

    jump(player) {

        if (!player.onGround) {
            return;
        }

        player.velocityY = JUMP_FORCE;
        player.onGround = false;

    }

}