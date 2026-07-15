export class Camera {

    constructor() {

        this.x = 0;

    }

    update(player) {

        this.x = player.x - 80;

        if (this.x < 0) {

            this.x = 0;

        }

    }

}