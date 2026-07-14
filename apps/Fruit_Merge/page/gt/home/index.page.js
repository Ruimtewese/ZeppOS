import * as hmUI from "@zos/ui";
import { setPageBrightTime } from "@zos/display";
import { setInterval } from "@zos/timer";
import { onKey } from "@zos/interaction";

Page({
  build() {

    hmUI.setStatusBarVisible(false);

    setPageBrightTime({
      brightTime: 2147483647
    });

    // =====================
    // SCREEN
    // =====================

    const WIDTH = 390;
    const HEIGHT = 450;

    const WALL_THICKNESS = 4;

    // =====================
    // CONTAINER
    // =====================
 
    const CONTAINER_Y = 50;
    const CONTAINER_WIDTH = 280;
    const CONTAINER_HEIGHT = 360;
    const CONTAINER_X = (WIDTH - CONTAINER_WIDTH) / 2;

    // =====================
    // BACKGROUND
    // =====================

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: WIDTH,
      h: HEIGHT,
      color: 0x000000
    });

    // =====================
    // CONTAINER WALLS
    // =====================

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: CONTAINER_X,
      y: CONTAINER_Y,
      w: WALL_THICKNESS,
      h: CONTAINER_HEIGHT,
      color: 0xFFFFFF
    });

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: CONTAINER_X + CONTAINER_WIDTH - WALL_THICKNESS,
      y: CONTAINER_Y,
      w: WALL_THICKNESS,
      h: CONTAINER_HEIGHT,
      color: 0xFFFFFF
    });

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: CONTAINER_X,
      y: CONTAINER_Y + CONTAINER_HEIGHT - WALL_THICKNESS,
      w: CONTAINER_WIDTH,
      h: WALL_THICKNESS,
      color: 0xFFFFFF
    });

    // =====================
    // GAME OVER LINE
    // =====================

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: CONTAINER_X + WALL_THICKNESS,
      y: CONTAINER_Y + 25,
      w: CONTAINER_WIDTH - WALL_THICKNESS * 2,
      h: 2,
      color: 0xFF4444
    });

    // =====================
    // FRUIT
    // =====================

    const FRUIT_SIZE = 35;
    const MOVE_SPEED = 8;

    let fruitX =
      CONTAINER_X +
      (CONTAINER_WIDTH - FRUIT_SIZE) / 2;

    let fruitY = CONTAINER_Y + 8;

    let velocityY = 0;
    const GRAVITY = 0.5;

    let dropped = false;

    const fruit = hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x: fruitX,
        y: fruitY,
        w: FRUIT_SIZE,
        h: FRUIT_SIZE,
        radius: FRUIT_SIZE / 2,
        color: 0xff0000
      }
    );

    // =====================
    // TOUCH CONTROL
    // =====================

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: CONTAINER_X,
      y: 0,
      w: CONTAINER_WIDTH,
      h: CONTAINER_Y,
      color: 0x000000,
      alpha: 1
    }).addEventListener(hmUI.event.MOVE, (info) => {

      if (dropped) return;

      fruitX = info.x - FRUIT_SIZE / 2;

      const minX =
        CONTAINER_X + WALL_THICKNESS;

      const maxX =
        CONTAINER_X +
        CONTAINER_WIDTH -
        WALL_THICKNESS -
        FRUIT_SIZE;

      if (fruitX < minX) fruitX = minX;
      if (fruitX > maxX) fruitX = maxX;

      fruit.setProperty(hmUI.prop.MORE, {
        x: fruitX,
        y: fruitY
      });

    });

    // =====================
    // HARDWARE BUTTONS
    // =====================

    onKey({

      callback: (key, event) => {

        if (event === 1) {

          // TOP BUTTON

          if (key === 36) {

            if (!dropped) {

              dropped = true;

            }

          }

          // BOTTOM BUTTON

          if (key === 93) {

          }

        }

        return true;

      }

    });

        // =====================
    // GAME LOOP
    // =====================

    setInterval(() => {

      // Move fruit while waiting to drop
      if (!dropped) {

        fruitY = CONTAINER_Y + 8;

      }

      // Falling physics
      if (dropped) {

        velocityY += GRAVITY;
        fruitY += velocityY;

        // Floor collision
        const floor =
          CONTAINER_Y +
          CONTAINER_HEIGHT -
          WALL_THICKNESS -
          FRUIT_SIZE;

        if (fruitY >= floor) {

          fruitY = floor;
          velocityY = 0;

          // Fruit has landed
          dropped = false;

          // Spawn a new fruit at the top
          fruitY = CONTAINER_Y + 8;
          velocityY = 0;

        }

      }

      // Keep fruit inside container horizontally
      const minX =
        CONTAINER_X + WALL_THICKNESS;

      const maxX =
        CONTAINER_X +
        CONTAINER_WIDTH -
        WALL_THICKNESS -
        FRUIT_SIZE;

      if (fruitX < minX) fruitX = minX;
      if (fruitX > maxX) fruitX = maxX;

      // Update fruit position
      fruit.setProperty(hmUI.prop.MORE, {
        x: fruitX,
        y: fruitY
      });

    }, 20);

  }

});