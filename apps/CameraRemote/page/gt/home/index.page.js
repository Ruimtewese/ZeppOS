import * as hmUI from "@zos/ui";
import { BasePage } from "@zeppos/zml/base-page";

Page(
  BasePage({

    state: {},

    build() {

      hmUI.createWidget(
        hmUI.widget.TEXT,
        {
          x: 20,
          y: 160,
          w: 440,
          h: 60,

          text: "Phone Test",

          text_size: 40,

          color: 0xffffff,

          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V
        }
      );

      const status = hmUI.createWidget(
        hmUI.widget.TEXT,
        {
          x: 20,
          y: 240,
          w: 440,
          h: 40,

          text: "Waiting...",

          text_size: 28,

          color: 0xffffff,

          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V
        }
      );

      hmUI.createWidget(
        hmUI.widget.BUTTON,
        {
          x: 120,
          y: 320,
          w: 240,
          h: 70,

          text: "SEND",

          click_func: () => {

            status.setProperty(hmUI.prop.TEXT, "Sending...");

            this.request({
              method: "hello",
              params: {
                text: "Hello Phone!"
              }
            })
            .then((result) => {

              status.setProperty(
                hmUI.prop.TEXT,
                "Reply: " + JSON.stringify(result)
              );

            })
            .catch((err) => {

              status.setProperty(
                hmUI.prop.TEXT,
                "Error"
              );

              console.log(err);

            });

          }
        }
      );

    }

  })
);