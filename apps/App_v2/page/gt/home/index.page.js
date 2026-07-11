import * as hmUI from "@zos/ui";
import { Accelerometer } from "@zos/sensor";
import { log as Logger } from "@zos/utils";

const logger = Logger.getLogger("AccelTest");

const accel = new Accelerometer();

let textWidget;
let rect;

// Screen and player size
const SCREEN_SIZE = 300;
const PLAYER_SIZE = 50;

// Player position
let playerX = 215;
let playerY = 215;

// Movement sensitivity
const speed = 0.02;

Page({
  build() {

    hmUI.setStatusBarVisible(false);

    textWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 10,
      w: 480,
      h: 50,
      text: "Waiting...",
      text_size: 28,
      color: 0xffffff,
      align_h: hmUI.align.CENTER_H
    });


    // Create player cube
    rect = hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x: playerX,
        y: playerY,
        w: PLAYER_SIZE,
        h: PLAYER_SIZE,
        color: 0xff0000
      }
    );


    accel.onChange(() => {

      const data = accel.getCurrent();
      
      // Round x y z values
      const x = Math.round(data.x);
      const y = Math.round(data.y);
      const z = Math.round(data.z);

      // Move player
      playerX -= x * speed;
      playerY += y * speed;


      // Prevent going outside edges
      const maxPosition = SCREEN_SIZE - PLAYER_SIZE;

      if (playerX < 0) {
        playerX = 0;
      }

      if (playerX > maxPosition) {
        playerX = maxPosition;
      }

      if (playerY < 0) {
        playerY = 0;
      }

      if (playerY > maxPosition) {
        playerY = maxPosition;
      }


      // Update cube position
      rect.setProperty(
        hmUI.prop.X,
        Math.round(playerX)
      );

      rect.setProperty(
        hmUI.prop.Y,
        Math.round(playerY)
      );

    });


    accel.start();

  }
});