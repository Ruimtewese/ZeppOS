import { createTimer } from "@zos/timer";
import { onKey } from "@zos/interaction";

import { FRAME_TIME } from "./constants.js";

import { Player } from "../objects/player.js";

import { Physics } from "./physics.js";
import { Collision } from "./collision.js";
import { Camera } from "./camera.js";
import { Renderer } from "./renderer.js";
import { Level } from "./level.js";

export class Game {

    constructor() {

        this.player = new Player();

        this.physics = new Physics();

        this.collision = new Collision();

        this.camera = new Camera();

        this.renderer = new Renderer();

        this.level = new Level();

    }

    start() {

        this.renderer.load(this.level.objects);

        this.renderer.createPlayer(this.player);

        onKey({

            callback: (key, event) => {

                if (event !== 1)
                    return true;

                if (key === 36) {

                    this.physics.jump(this.player);

                }

                return true;

            }

        });

        createTimer(

            0,

            FRAME_TIME,

            () => this.update()

        );

    }

    update() {

        if (this.player.dead) {

            this.collision.restart(

                this.player,

                this.camera

            );

        }

        this.physics.update(this.player);

        this.collision.update(

            this.player,

            this.level

        );

        this.camera.update(this.player);

        this.renderer.update(

            this.player,

            this.camera

        );

    }

}