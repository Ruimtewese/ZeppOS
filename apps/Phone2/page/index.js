import * as hmUI from "@zos/ui";
import * as Styles from "zosLoader:./index.[pf].layout.js";

Page({
  build() {

    hmUI.createWidget(
      hmUI.widget.TEXT,
      {
        ...Styles.TITLE
      }
    );

    hmUI.createWidget(
      hmUI.widget.BUTTON,
      {
        ...Styles.SEND_BUTTON,

        click_func() {
          console.log("SEND");
        }
      }
    );

    console.log("Page built");

  }
});