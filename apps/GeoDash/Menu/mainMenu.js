import * as hmUI from "@zos/ui";
import { onKey } from "@zos/interaction";

import { SPRITES } from "../Engine/constants.js";

export class MainMenu {

    constructor(onPlay) {

        this.onPlay = onPlay;

        // Background
        this.background = hmUI.createWidget(
            hmUI.widget.IMG,
            {
                x: 0,
                y: 0,
                src: SPRITES.background
            }
        );

        // Title
        this.title = hmUI.createWidget(
            hmUI.widget.TEXT,
            {
                x: 0,
                y: 70,
                w: 390,
                h: 60,

                text: "GEODASH",

                text_size: 40,
                color: 0xFFFFFF,

                align_h: hmUI.align.CENTER_H,
                align_v: hmUI.align.CENTER_V
            }
        );

        // Play Button
        this.play = hmUI.createWidget(
            hmUI.widget.BUTTON,
            {
                x: 95,
                y: 190,
                w: 200,
                h: 60,

                text: "PLAY",

                normal_color: 0xF7D038,
                press_color: 0xD6B11F,

                click_func: () => {

                    if (this.onPlay) {
                        this.destroy();
                        this.onPlay();
                    }

                }
            }
        );

        // Hint
        this.info = hmUI.createWidget(
            hmUI.widget.TEXT,
            {
                x: 0,
                y: 290,
                w: 390,
                h: 40,

                text: "Press PLAY",

                text_size: 22,
                color: 0xFFFFFF,

                align_h: hmUI.align.CENTER_H,
                align_v: hmUI.align.CENTER_V
            }
        );

        // Optional: Top hardware button starts the game too
        onKey({
            callback: (key, event) => {

                if (event !== 1)
                    return true;

                if (key === 36) {

                    if (this.onPlay) {
                        this.destroy();
                        this.onPlay();
                    }

                }

                return true;
            }
        });

    }

    destroy() {

        hmUI.deleteWidget(this.background);
        hmUI.deleteWidget(this.title);
        hmUI.deleteWidget(this.play);
        hmUI.deleteWidget(this.info);

    }

}