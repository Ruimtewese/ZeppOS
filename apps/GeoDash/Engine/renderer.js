import * as hmUI from "@zos/ui";

import {
    SPRITES
} from "./constants.js";

// Amount to overlap floor tiles (pixels)
const FLOOR_OVERLAP = 10;

export class Renderer {

    constructor() {

        this.widgets = [];

        // =====================
        // Background
        // =====================

        this.background = hmUI.createWidget(
            hmUI.widget.IMG,
            {
                x: 0,
                y: 0,
                src: SPRITES.background
            }
        );

    }

    // =====================
    // Draw Level
    // =====================

    load(objects) {

        for (const obj of objects) {

            let widget = null;

            switch (obj.type) {

                // =====================
                // Floor
                // =====================

                case "floor":

                    widget = hmUI.createWidget(
                        hmUI.widget.IMG,
                        {
                            // Pull every tile after the first 2px left
                            x: obj.x - Math.floor(obj.x / 40) * FLOOR_OVERLAP,
                            y: obj.y,
                            src: SPRITES.floor
                        }
                    );

                    break;

                // =====================
                // Block
                // =====================

                case "block":

                    widget = hmUI.createWidget(
                        hmUI.widget.IMG,
                        {
                            x: obj.x,
                            y: obj.y,
                            src: SPRITES.block
                        }
                    );

                    break;

                // =====================
                // Spike
                // =====================

                case "spike":

                    widget = hmUI.createWidget(
                        hmUI.widget.IMG,
                        {
                            x: obj.x,
                            y: obj.y,
                            src: SPRITES.spike
                        }
                    );

                    break;

            }

            if (widget) {

                this.widgets.push({

                    object: obj,
                    widget: widget

                });

            }

        }

    }

    // =====================
    // Player
    // =====================

    createPlayer(player) {

        this.playerWidget = hmUI.createWidget(
            hmUI.widget.IMG,
            {
                x: player.x,
                y: player.y,
                src: SPRITES.player
            }
        );

    }

    // =====================
    // Update
    // =====================

    update(player, camera) {

        // ---------------------
        // Player
        // ---------------------

        this.playerWidget.setProperty(

            hmUI.prop.MORE,

            {
                x: Math.round(player.x - camera.x),
                y: Math.round(player.y)
            }

        );

        // ---------------------
        // World
        // ---------------------

        for (const item of this.widgets) {

            let drawX = item.object.x;

            // Overlap floor tiles slightly
            if (item.object.type === "floor") {

                drawX -= Math.floor(item.object.x / 40) * FLOOR_OVERLAP;

            }

            item.widget.setProperty(

                hmUI.prop.MORE,

                {
                    x: Math.round(drawX - camera.x),
                    y: Math.round(item.object.y)
                }

            );

        }

    }

}