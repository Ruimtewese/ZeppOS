import * as hmUI from "@zos/ui";
import { setPageBrightTime } from "@zos/display";

Page({
  build() {
    
    setPageBrightTime({
      brightTime: 100000000
    });

    const WIDTH = 390;
    const HEIGHT = 450;
    const CIRCLE_SIZE = 100;

    // Background
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: WIDTH,
      h: HEIGHT,
      color: 0x000000,
    });

    // Circle
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: (WIDTH - CIRCLE_SIZE) / 2,
      y: (HEIGHT - CIRCLE_SIZE) / 2,
      w: CIRCLE_SIZE,
      h: CIRCLE_SIZE,
      radius: CIRCLE_SIZE / 2,
      color: 0xff0000,
    });
  }
});