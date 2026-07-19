import { getDeviceInfo } from "@zos/device";
import { px } from "@zos/utils";
import * as hmUI from "@zos/ui";

export const { width: WIDTH, height: HEIGHT } = getDeviceInfo();

export const TITLE = {
  x: 0,
  y: px(70),
  w: WIDTH,
  h: px(50),

  text: "Phone Test",

  color: 0xffffff,

  text_size: px(36),

  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V
};

export const SEND_BUTTON = {
  x: px(45),
  y: px(180),
  w: WIDTH - px(90),
  h: px(70),

  text: "SEND"
};