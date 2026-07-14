import * as hmUI from "@zos/ui";
import { setPageBrightTime } from "@zos/display";
import { setInterval } from "@zos/timer";
import { onKey } from "@zos/interaction";


Page({

  build(){


    hmUI.setStatusBarVisible(false);


    setPageBrightTime({
      brightTime:2147483647
    });



    const WIDTH = 390;
    const HEIGHT = 450;



    // =====================
    // BOX
    // =====================

    const WALL = 4;

    const BOX_Y = 50;
    const BOX_W = 280;
    const BOX_H = 360;

    const BOX_X =
      (WIDTH - BOX_W) / 2;




    // =====================
    // BACKGROUND
    // =====================

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




    // =====================
    // WALLS
    // =====================

    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x:BOX_X,
        y:BOX_Y,
        w:WALL,
        h:BOX_H,
        color:0xffffff
      }
    );


    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x:BOX_X+BOX_W-WALL,
        y:BOX_Y,
        w:WALL,
        h:BOX_H,
        color:0xffffff
      }
    );


    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x:BOX_X,
        y:BOX_Y+BOX_H-WALL,
        w:BOX_W,
        h:WALL,
        color:0xffffff
      }
    );





    // =====================
    // FRUIT
    // =====================

    const SIZE = 35;

    const GRAVITY = 0.5;


    let fruitX =
      BOX_X+(BOX_W-SIZE)/2;


    let fruitY =
      BOX_Y+8;


    let velocityY = 0;


    let dropped = false;




    function createFruit(){


      return hmUI.createWidget(
        hmUI.widget.FILL_RECT,
        {
          x:fruitX,
          y:fruitY,
          w:SIZE,
          h:SIZE,
          radius:SIZE/2,
          color:0xff0000
        }
      );


    }



    let fruit = createFruit();





    // =====================
    // TEST BUTTONS
    // =====================


    hmUI.createWidget(
      hmUI.widget.BUTTON,
      {
        x:0,
        y:0,
        w:120,
        h:60,

        text:"LEFT",

        color:0x555555,


        click_func(){


          console.log("LEFT");


          if(!dropped){


            fruitX -= 25;


          }


        }

      }
    );




    hmUI.createWidget(
      hmUI.widget.BUTTON,
      {
        x:270,
        y:0,
        w:120,
        h:60,

        text:"RIGHT",

        color:0x555555,


        click_func(){


          console.log("RIGHT");


          if(!dropped){


            fruitX += 25;


          }


        }

      }
    );

        // =====================
    // DROP BUTTON
    // =====================


    onKey({

      callback:(key,event)=>{


        if(event === 1){


          if(key === 36){


            if(!dropped){


              dropped = true;


            }


          }


        }


        return true;

      }

    });






    // =====================
    // GAME LOOP
    // =====================


    setInterval(()=>{



      if(dropped){


        velocityY += GRAVITY;


        fruitY += velocityY;



        const floor =

          BOX_Y +
          BOX_H -
          WALL -
          SIZE;




        if(fruitY >= floor){


          fruitY = floor;


          velocityY = 0;


          dropped = false;



          fruit = createFruit();


        }


      }





      // limit movement

      const minX =
        BOX_X + WALL;


      const maxX =
        BOX_X +
        BOX_W -
        WALL -
        SIZE;



      if(fruitX < minX)
        fruitX = minX;



      if(fruitX > maxX)
        fruitX = maxX;




      fruit.setProperty(

        hmUI.prop.MORE,

        {
          x:fruitX,
          y:fruitY
        }

      );



    },20);



  }

});