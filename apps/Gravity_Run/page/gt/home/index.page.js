import * as hmUI from "@zos/ui";
import { setInterval } from "@zos/timer";


const WIDTH = 390;
const HEIGHT = 450;


let playerY = 200;
let velocity = 0;

const gravity = 0.4;

let player;



Page({

  build() {


    hmUI.setStatusBarVisible(false);



    // background

    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x:0,
        y:0,
        w:WIDTH,
        h:HEIGHT,
        color:0x000000
      }
    );



    // TOUCH BUTTON FIRST

    hmUI.createWidget(
      hmUI.widget.BUTTON,
      {
        x:0,
        y:0,
        w:WIDTH,
        h:HEIGHT,
        text:"",
        color:0x000000,
        alpha:0,

        click_func(){

          velocity = -7;

        }
      }
    );



    // PLAYER LAST (on top)

    player = hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x:170,
        y:playerY,
        w:50,
        h:50,
        color:0x00ff00
      }
    );



    // physics

    setInterval(()=>{


      velocity += gravity;

      playerY += velocity;



      if(playerY > HEIGHT-50){

        playerY = HEIGHT-50;
        velocity = 0;

      }



      if(playerY < 0){

        playerY = 0;
        velocity = 0;

      }



      player.setProperty(
        hmUI.prop.Y,
        playerY
      );


    },20);



  }

});