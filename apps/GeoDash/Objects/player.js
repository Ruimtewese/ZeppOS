import {
    PLAYER_START_X,
    PLAYER_START_Y
} from "../engine/constants.js";

export class Player {

    constructor() {

        this.x = PLAYER_START_X;
        this.y = PLAYER_START_Y;

        this.velocityY = 0;

        this.onGround = true;

        this.dead = false;

    }

}