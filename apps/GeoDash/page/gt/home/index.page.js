import * as hmUI from "@zos/ui";


Page({

  build() {


    hmUI.setStatusBarVisible(false);



    // Background

    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x:0,
        y:0,
        w:480,
        h:480,
        color:0x000000
      }
    );



    // Text

    hmUI.createWidget(
      hmUI.widget.TEXT,
      {
        x:0,
        y:40,
        w:480,
        h:50,
        text:"SPIKE TEST",
        text_size:40,
        color:0xffffff,
        align:"center"
      }
    );



    // Spike

    hmUI.createWidget(
      hmUI.widget.IMG,
      {
        x:180,
        y:200,

        w:80,
        h:60,

        src:"image3.png"
      }
    );


  }

});