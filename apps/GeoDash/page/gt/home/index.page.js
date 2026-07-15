import * as hmUI from "@zos/ui";
import { createTimer } from "@zos/timer";

import { Game } from "../../../Engine/game.js";

Page({

    build() {

        hmUI.setStatusBarVisible(false);

        const menuWidgets = [];

        // =====================================================
        // Helpers
        // =====================================================

        function addWidget(widget) {

            menuWidgets.push(widget);
            return widget;

        }

        function setMenuVisible(visible) {

            for (const widget of menuWidgets) {

                widget.setProperty(
                    hmUI.prop.VISIBLE,
                    visible
                );

            }

        }

        // =====================================================
        // Background
        // =====================================================

        addWidget(

            hmUI.createWidget(
                hmUI.widget.IMG,
                {
                    x: 0,
                    y: 0,
                    src: "background1.png"
                }
            )

        );

        // =====================================================
        // Floating Detail Images
        // =====================================================

        const details = [];

        for (let i = 0; i < 8; i++) {

            const widget = addWidget(

                hmUI.createWidget(
                    hmUI.widget.IMG,
                    {
                        x: 0,
                        y: 0,
                        src: "detail.png"
                    }
                )

            );

            details.push({

                x: Math.random() * 390,
                y: Math.random() * 450,

                speed: 0.5 + Math.random(),

                drift:
                    (Math.random() - 0.5) * 0.3,

                widget

            });

        }

        createTimer(

            0,

            16,

            () => {

                for (const detail of details) {

                    detail.x -= detail.speed;
                    detail.y += detail.drift;

                    if (detail.x < -40) {

                        detail.x = 430;
                        detail.y = Math.random() * 450;

                    }

                    detail.widget.setProperty(

                        hmUI.prop.MORE,

                        {
                            x: Math.round(detail.x),
                            y: Math.round(detail.y)
                        }

                    );

                }

            }

        );

        // =====================================================
        // Title
        // =====================================================

        addWidget(

            hmUI.createWidget(
                hmUI.widget.TEXT,
                {
                    x: 0,
                    y: 60,
                    w: 390,
                    h: 70,

                    text: "GEODASH",

                    text_size: 44,

                    color: 0xFFFFFF,

                    align_h: hmUI.align.CENTER_H,
                    align_v: hmUI.align.CENTER_V
                }
            )

        );

                // =====================================================
        // Subtitle
        // =====================================================

        addWidget(

            hmUI.createWidget(
                hmUI.widget.TEXT,
                {
                    x: 0,
                    y: 112,
                    w: 390,
                    h: 30,

                    text: "Geometry Dash for Zepp",

                    text_size: 20,

                    color: 0xDDDDDD,

                    align_h: hmUI.align.CENTER_H,
                    align_v: hmUI.align.CENTER_V
                }
            )

        );


        // =====================================================
        // Play Button Background
        // =====================================================

        addWidget(

            hmUI.createWidget(
                hmUI.widget.FILL_RECT,
                {
                    x: 75,
                    y: 185,
                    w: 240,
                    h: 70,

                    radius: 18,

                    color: 0x1FC96B
                }
            )

        );


        // =====================================================
        // Play Button
        // =====================================================

        addWidget(

            hmUI.createWidget(
                hmUI.widget.BUTTON,
                {
                    x: 75,
                    y: 185,
                    w: 240,
                    h: 70,

                    text: "PLAY",

                    normal_color: 0x000000,
                    press_color: 0x000000,


                    click_func: () => {

                        // Hide menu

                        setMenuVisible(false);


                        // Start game

                        const game = new Game();

                        game.start();

                    }

                }
            )

        );


        // =====================================================
        // Version Text
        // =====================================================

        addWidget(

            hmUI.createWidget(
                hmUI.widget.TEXT,
                {
                    x: 0,
                    y: 415,
                    w: 390,
                    h: 25,

                    text: "Version 1.0",

                    text_size: 18,

                    color: 0xBBBBBB,

                    align_h: hmUI.align.CENTER_H,
                    align_v: hmUI.align.CENTER_V
                }
            )

        );

    }

}); 