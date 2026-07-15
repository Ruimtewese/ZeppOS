import {
    FLOOR_Y,
    PLAYER_SIZE,
    TILE_SIZE,
    PLAYER_START_X,
    PLAYER_START_Y
} from "./constants.js";

export class Collision {

    update(player, level) {

        player.onGround = false;

        // ------------------------
        // Floor
        // ------------------------

        if (player.y >= FLOOR_Y - PLAYER_SIZE) {

            player.y = FLOOR_Y - PLAYER_SIZE;
            player.velocityY = 0;
            player.onGround = true;

        }

        // ------------------------
        // Blocks & Spikes
        // ------------------------

        for (const obj of level.objects) {

            if (
                player.x + PLAYER_SIZE <= obj.x ||
                player.x >= obj.x + TILE_SIZE ||
                player.y + PLAYER_SIZE <= obj.y ||
                player.y >= obj.y + TILE_SIZE
            ) {
                continue;
            }

            // ========================
            // Spike
            // ========================

            if (obj.type === "spike") {

                player.dead = true;
                return;

            }

            // ========================
            // Block
            // ========================

            if (obj.type !== "block") {
                continue;
            }

            const cameFromAbove =
                player.previousY + PLAYER_SIZE <= obj.y;

            if (cameFromAbove && player.velocityY >= 0) {

                // Safe landing

                player.y = obj.y - PLAYER_SIZE;
                player.velocityY = 0;
                player.onGround = true;

            } else {

                // Side or underside

                player.dead = true;
                return;

            }

        }

    }

    restart(player, camera) {

        player.x = PLAYER_START_X;
        player.y = PLAYER_START_Y;

        player.previousX = player.x;
        player.previousY = player.y;

        player.velocityY = 0;

        player.dead = false;
        player.onGround = true;

        camera.x = 0;

    }

}