import * as hmUI from "@zos/ui";
import { log as Logger } from "@zos/utils";
import { TEXT_STYLE } from "zosLoader:./index.page.[pf].layout.js";

const logger = Logger.getLogger("PhoneTest");

Page({
  onInit() {
    logger.debug("Page initialized");
  },

  build() {
    hmUI.createWidget(hmUI.widget.TEXT, TEXT_STYLE);

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 40,
      y: 300,
      w: 310,
      h: 60,
      text: "SEND",

      click_func: () => {
        const { messageBuilder } = getApp().globalData;

        if (!messageBuilder) {
          console.log("No MessageBuilder");
          return;
        }

        messageBuilder.request({
          method: "HELLO",
          params: {
            text: "Hello Phone"
          }
        })
        .then((result) => {
          console.log("Reply:", result);
        })
        .catch((err) => {
          console.log("Error:", err);
        });
      }
    });

    logger.debug("Page built");
  },

  onDestroy() {
    logger.debug("Page destroyed");
  }
});