import * as hmUI from "@zos/ui";
import { Accelerometer } from "@zos/sensor";
import { setPageBrightTime } from "@zos/display";

// =====================
// SCREEN
// =====================

const WIDTH = 390;
const HEIGHT = 450;


// =====================
// VARIABLES
// =====================

let reps = 0;
let running = false;

let counterText;
let statusText;

let sensor;


// Movement detection

let down = false;

const THRESHOLD_DOWN = -4;
const THRESHOLD_UP = 4;


// Prevent double counts

let lastRepTime = 0;
const REP_COOLDOWN = 1500;


// =====================
// UI
// =====================

Page({

  build() {

    setPageBrightTime({
    brightTime: 2147483000
});

    hmUI.setStatusBarVisible(false);


    // Background

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


    // Title

    hmUI.createWidget(
      hmUI.widget.TEXT,
      {
        x:0,
        y:40,
        w:WIDTH,
        h:50,
        text:"PUSH UPS",
        text_size:40,
        color:0xffffff,
        align:"center"
      }
    );


    // Counter

    counterText = hmUI.createWidget(
      hmUI.widget.TEXT,
      {
        x:0,
        y:120,
        w:WIDTH,
        h:100,
        text:"0",
        text_size:90,
        color:0x00ff00,
        align:"center"
      }
    );


    // Status

    statusText = hmUI.createWidget(
      hmUI.widget.TEXT,
      {
        x:0,
        y:230,
        w:WIDTH,
        h:40,
        text:"READY",
        text_size:30,
        color:0xffffff,
        align:"center"
      }
    );


    // Start button

    hmUI.createWidget(
      hmUI.widget.BUTTON,
      {
        x:95,
        y:330,
        w:200,
        h:70,

        text:"START",

        text_size:30,

        click_func(){

          startCounter();

        }
      }
    );


  }

});


// =====================
// START COUNTER
// =====================

function startCounter(){


  if(running)
    return;


  running = true;


  reps = 0;
  down = false;


  counterText.setProperty(
    hmUI.prop.TEXT,
    "0"
  );


  statusText.setProperty(
    hmUI.prop.TEXT,
    "STARTED"
  );


  sensor = new Accelerometer();


  sensor.onChange((data)=>{


    let y = data.y;


    // Going down

    if(y < THRESHOLD_DOWN){

      down = true;

    }


    // Coming back up

    if(y > THRESHOLD_UP && down){


      let now = Date.now();


      if(now - lastRepTime > REP_COOLDOWN){


        reps++;


        counterText.setProperty(
          hmUI.prop.TEXT,
          reps.toString()
        );


        lastRepTime = now;


      }


      down = false;


    }


  });


  sensor.start();


}