import * as hmUI from "@zos/ui";
import { setPageBrightTime } from "@zos/display";
import { setInterval } from "@zos/timer";

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

    let fruitX = CONTAINER_X + (CONTAINER_WIDTH - FRUIT_SIZE) / 2;
    let fruitY = CONTAINER_Y - 20;

    let velocityY = 0;
    const GRAVITY = 0.5;

    let dropped = false;


    const fruit = hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: fruitX,
      y: fruitY,
      w: FRUIT_SIZE,
      h: FRUIT_SIZE,
      radius: FRUIT_SIZE / 2,
      color: 0xff0000
    });

hmUI.createWidget(hmUI.widget.BUTTON, {
  x: (WIDTH - 100) / 2,
  y: CONTAINER_Y + CONTAINER_HEIGHT + 10,
  w: 100,
  h: 20,
  text: "DROP",
  text_size: 20,
  color: 0xffffff,
  normal_color: 0x444444,
  press_color: 0x888888
}).addEventListener(hmUI.event.CLICK_DOWN, () => {

  dropped = true;

});

    // =====================
    // GAME LOOP
    // =====================

setInterval(() => {

  if (dropped) {

    velocityY += GRAVITY;
    fruitY += velocityY;

    // Floor collision
    const floor = CONTAINER_Y + CONTAINER_HEIGHT - WALL_THICKNESS - FRUIT_SIZE;

    if (fruitY >= floor) {
      fruitY = floor;
      velocityY = 0;
    }

  }


  fruit.setProperty(hmUI.prop.MORE, {
    x: fruitX,
    y: fruitY
  });


}, 20);
}});