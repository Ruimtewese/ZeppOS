import * as hmUI from "@zos/ui";
import { Accelerometer } from "@zos/sensor";


const accel = new Accelerometer();


// =====================
// BIRD
// =====================

let bird;

let birdY = 200;
let velocity = 0;


const GRAVITY = 0.18;
const JUMP_FORCE = -6;



// =====================
// SENSOR
// =====================

let lastValue = 0;

let canJump = false;


const FLICK_THRESHOLD = 80;
const COOLDOWN = 700;



// =====================
// PAGE
// =====================

Page({

build(){


  hmUI.setStatusBarVisible(false);



  // background

  hmUI.createWidget(
    hmUI.widget.FILL_RECT,
    {
      x:0,
      y:0,
      w:390,
      h:450,
      color:0x87ceeb
    }
  );



  // bird

  bird =
  hmUI.createWidget(
    hmUI.widget.FILL_RECT,
    {
      x:80,
      y:birdY,
      w:16,
      h:16,
      color:0xffff00
    }
  );



  // wait for sensor

  setTimeout(()=>{


    let data =
      accel.getCurrent();


    lastValue = data.y;

    canJump = true;


  },3000);



  // flick detection

  accel.onChange(()=>{


    if(!canJump)
      return;



    let data =
      accel.getCurrent();



    let change =
      data.y - lastValue;



    if(
      change < -FLICK_THRESHOLD
    ){


      velocity = JUMP_FORCE;


      canJump = false;



      setTimeout(()=>{


        let newData =
          accel.getCurrent();


        lastValue = newData.y;

        canJump = true;


      },COOLDOWN);


    }



    lastValue = data.y;


  });



  accel.start();



  // physics

  setInterval(()=>{


    velocity += GRAVITY;


    birdY += velocity;



    // ceiling

    if(birdY < 0){

      birdY = 0;

      velocity = 0;

    }



    // floor

    if(birdY > 430){

      birdY = 430;

      velocity = 0;

    }



    bird.setProperty(
      hmUI.prop.Y,
      Math.round(birdY)
    );



  },20);


}

});