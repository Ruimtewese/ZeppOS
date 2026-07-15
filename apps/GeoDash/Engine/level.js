import {

    TILE_SIZE,
    FLOOR_Y

} from "./constants.js";

import level from "../levels/level1.js";

export class Level {

    constructor() {

        this.objects = [];

        this.build();

    }

    build() {

        this.objects = [];

        for (let row = 0; row < level.length; row++) {

            const line = level[row];

            for (let col = 0; col < line.length; col++) {

                const c = line[col];

                const x = col * TILE_SIZE;

                const y = row * TILE_SIZE - 30;

                switch (c) {

                    case "#":

                        this.objects.push({

                            type: "floor",

                            x,

                            y

                        });

                        break;

                    case "^":

                        this.objects.push({

                            type: "spike",

                            x,

                            y

                        });

                        break;

                    case "[":

                    case "]":

                        this.objects.push({

                            type: "block",

                            x,

                            y

                        });

                        break;

                }

            }

        }

    }

}