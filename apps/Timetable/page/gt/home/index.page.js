import * as hmUI from "@zos/ui";
import { onKey } from "@zos/interaction";
import { setInterval } from "@zos/timer";

import timetableData from "../../../assets/timetable.js";


// =====================================================
// DATA
// =====================================================

let timetable = timetableData;


// =====================================================
// DEBUG
// =====================================================

const DEBUG_MODE = false;
const DEBUG_TIME = "09:38";


// =====================================================
// DISPLAY SETTINGS
// =====================================================

const SHOW_ROOM = true;
const SHOW_TEACHER = false;
const SHOW_TIME = true;
const SHOW_ABBREVIATION = true;
const SHOW_NEXT_LESSON = true;


// =====================================================
// COLORS
// =====================================================

const COLOR_BG = 0x000000;
const COLOR_CARD = 0x202020;
const COLOR_ACCENT = 0x4DA3FF;
const COLOR_GREEN = 0x00C853;
const COLOR_ORANGE = 0xFF9800;
const COLOR_RED = 0xF44336;
const COLOR_TEXT = 0xFFFFFF;
const COLOR_GREY = 0xAAAAAA;


// =====================================================
// SCREEN
// =====================================================

const WIDTH = 390;
const HEIGHT = 450;


// =====================================================
// VARIABLES
// =====================================================

let widgets = [];

let selectedDay = null;

let screen = "days";

let refreshTimer = null;


// =====================================================
// PAGE
// =====================================================

Page({

  build(){

    hmUI.setStatusBarVisible(false);

    showDaySelection();


    refreshTimer = setInterval(()=>{

      if(screen === "lesson"){

        showSelectedDay();

      }

    },60000);


  }

});


// =====================================================
// CLEAR SCREEN
// =====================================================

function clearScreen(){

  widgets.forEach(widget=>{

    hmUI.deleteWidget(widget);

  });


  widgets = [];

}


// =====================================================
// RECTANGLE
// =====================================================

function createRectangle(
x,
y,
w,
h,
color = COLOR_CARD
){


  let widget =
  hmUI.createWidget(

    hmUI.widget.FILL_RECT,

    {

      x:x,
      y:y,

      w:w,
      h:h,

      color:color,

      radius:10

    }

  );

 
  widgets.push(widget);


  return widget;

}



// =====================================================
// TEXT
// =====================================================

function createText(
text,
x,
y,
w,
h,
size,
color = COLOR_TEXT
){


  let widget =
  hmUI.createWidget(

    hmUI.widget.TEXT,

    {

      x:x,
      y:y,

      w:w,
      h:h,

      text:text,

      text_size:size,

      color:color,


      align_h:
      hmUI.align.CENTER_H,


      align_v:
      hmUI.align.CENTER_V

    }

  );


  widgets.push(widget);


  return widget;

}



// =====================================================
// ACCENT LINE
// =====================================================

function createAccentLine(
y,
color = COLOR_ACCENT
){


  createRectangle(

    25,

    y,

    340,

    5,

    color

  );


}



// =====================================================
// BADGE
// =====================================================

function createBadge(
text,
x,
y,
w
){


  createRectangle(

    x,

    y,

    w,

    35,

    0x303030

  );


  createText(

    text,

    x,

    y+3,

    w,

    30,

    16

  );


}



// =====================================================
// TIME DEBUG
// =====================================================

function getCurrentMinutes(){


  if(DEBUG_MODE){

    return toMinutes(DEBUG_TIME);

  }


  let now = new Date();


  return (

    now.getHours()*60

    +

    now.getMinutes()

  );


}

// =====================================================
// DAY SELECT SCREEN
// =====================================================

function showDaySelection(){

  clearScreen();

  screen="days";


  createText(
    "Select Day",
    20,
    20,
    350,
    40,
    28
  );


  timetable.timetable.days.forEach(

  (day,index)=>{


    let button =
    hmUI.createWidget(

      hmUI.widget.BUTTON,

      {

        x:40,

        y:80+(index*42),

        w:310,

        h:35,

        text:day.name,


        normal_color:0x303030,

        press_color:0x4DA3FF,


        radius:12,


        click_func:()=>{


          selectedDay=day;

          showSelectedDay();


        }

      }

    );


    widgets.push(button);


  });


}



// =====================================================
// MAIN LESSON SCREEN
// =====================================================

function showSelectedDay(){


  clearScreen();


  screen="lesson";


  createText(

    selectedDay.name,

    20,

    5,

    350,

    35,

    22

  );



  let currentMinutes =
  getCurrentMinutes();



  let periods =
  selectedDay.periods;



  let currentIndex=-1;



  periods.forEach(

    (period,index)=>{


      if(

        currentMinutes >=
        toMinutes(period.start)

        &&

        currentMinutes <
        toMinutes(period.end)

      ){

        currentIndex=index;

      }


    }

  );



  // SCHOOL FINISHED

  if(

    currentMinutes >=
    toMinutes(
      periods[periods.length-1].end
    )

  ){


    drawFinished();

    return;


  }



  // BEFORE SCHOOL

  if(

    currentMinutes <
    toMinutes(periods[0].start)

  ){


    createRectangle(
      20,
      100,
      350,
      120
    );


    createText(
      "School\nnot started",
      30,
      130,
      330,
      60,
      28
    );


    return;


  }



  // CURRENT LESSON

  if(currentIndex >= 0){


    let current =
    periods[currentIndex];


    drawCurrent(current);



    if(
      SHOW_NEXT_LESSON
      &&
      currentIndex+1 < periods.length
    ){

      drawNext(
        periods[currentIndex+1]
      );

    }


    return;


  }



  // BREAK

  drawBreak();



}



// =====================================================
// CURRENT LESSON CARD
// =====================================================

function drawCurrent(period){


  let subject;


  if(
    !period.subjectId
    ||
    period.subjectId==="BREAK"
  ){


    subject={

      longName:"BREAK",

      abbreviation:""

    };


  }
  else{


    subject =
    getSubject(
      period.subjectId
    );


  }



  createRectangle(

    15,

    45,

    360,

    250

  );



  createAccentLine(45);



  createText(

    "CURRENT",

    20,

    65,

    350,

    25,

    18,

    COLOR_ACCENT

  );



  createText(

    subject.longName,

    20,

    100,

    350,

    50,

    34

  );



  if(SHOW_ABBREVIATION){


    createText(

      subject.abbreviation,

      20,

      150,

      350,

      25,

      20,

      COLOR_GREY

    );


  }



  if(SHOW_TIME){


    createText(

      period.start+
      " - "+
      period.end,

      20,

      185,

      350,

      30,

      18

    );


  }



  let remaining =
  getRemainingMinutes(
    period.end
  );


  createText(

    remaining+
    " min remaining",

    20,

    220,

    350,

    30,

    20,

    COLOR_GREEN

  );



  drawProgress(period);



}



// =====================================================
// NEXT LESSON
// =====================================================

function drawNext(period){


  let subject;


  if(
    !period.subjectId
    ||
    period.subjectId==="BREAK"
  ){

    subject={
      longName:"BREAK"
    };

  }
  else{

    subject =
    getSubject(
      period.subjectId
    );

  }



  createRectangle(

    15,

    320,

    360,

    100

  );



  createText(

    "NEXT UP",

    20,

    330,

    350,

    20,

    16,

    COLOR_ACCENT

  );



  createText(

    subject.longName,

    20,

    360,

    350,

    30,

    24

  );


}



// =====================================================
// BREAK SCREEN
// =====================================================

function drawBreak(){


  createRectangle(

    20,

    110,

    350,

    140

  );


  createAccentLine(

    110,

    COLOR_ORANGE

  );


  createText(

    "☕ BREAK",

    20,

    150,

    350,

    40,

    30,

    COLOR_ORANGE

  );


}



// =====================================================
// FINISHED
// =====================================================

function drawFinished(){


  createRectangle(

    20,

    120,

    350,

    130

  );


  createAccentLine(

    120,

    COLOR_GREEN

  );


  createText(

    "✓ SCHOOL FINISHED",

    20,

    170,

    350,

    40,

    24,

    COLOR_GREEN

  );


}



// =====================================================
// PROGRESS BAR
// =====================================================

function drawProgress(period){


  let start =
  toMinutes(period.start);


  let end =
  toMinutes(period.end);


  let now =
  getCurrentMinutes();



  let percent =
  (now-start)/(end-start);



  if(percent<0)
    percent=0;


  if(percent>1)
    percent=1;



  createRectangle(

    35,

    270,

    320,

    8,

    0x404040

  );


  createRectangle(

    35,

    270,

    320*percent,

    8,

    COLOR_GREEN

  );


}

// =====================================================
// SUBJECT LOOKUP
// =====================================================

function getSubject(id){


  let subject =

  timetable.timetable.subjects.find(

    item =>
    item.id === id

  );


  if(subject){

    return subject;

  }



  return {

    longName:"Unknown",

    abbreviation:"",

    room:"",

    teacher:""

  };


}



// =====================================================
// TIME CONVERSION
// =====================================================

function toMinutes(time){


  let parts =
  time.split(":");


  return (

    Number(parts[0]) * 60

    +

    Number(parts[1])

  );


}



// =====================================================
// REMAINING TIME
// =====================================================

function getRemainingMinutes(end){


  let now =
  getCurrentMinutes();


  let finish =
  toMinutes(end);


  let result =
  finish-now;


  if(result < 0){

    result=0;

  }


  return result;


}



// =====================================================
// BUTTON CONTROLS
// =====================================================

onKey({

callback:(key,event)=>{


  if(event===1){


    // BACK BUTTON

    if(key===36){


      if(screen==="lesson"){


        showDaySelection();


      }


    }



    // SELECT BUTTON

    if(key===93){


      if(screen==="lesson"){


        showSelectedDay();


      }


    }


  }


  return true;


}

});