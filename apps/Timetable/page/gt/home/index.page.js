import * as hmUI from "@zos/ui";
import { onKey } from "@zos/interaction";

import timetableData from "../../../assets/timetable.js";


// =====================
// DATA
// =====================

let timetable = timetableData;


// =====================
// DEBUG
// =====================

const DEBUG_MODE = true;
const DEBUG_TIME = "10:30";


// =====================
// DISPLAY SETTINGS
// =====================

const SHOW_ROOM = false;
const SHOW_TEACHER = false;
const SHOW_TIME = true;
const SHOW_ABBREVIATION = true;
const SHOW_NEXT_LESSON = true;


// =====================
// VARIABLES
// =====================

let widgets = [];

let selectedDay = null;

let screen = "days";



// =====================
// PAGE
// =====================

Page({

  build(){

    hmUI.setStatusBarVisible(false);

    showDaySelection();

  }

});



// =====================
// CLEAR SCREEN
// =====================

function clearScreen(){

  widgets.forEach(widget=>{

    hmUI.deleteWidget(widget);

  });


  widgets=[];

}



// =====================
// RECTANGLE
// =====================

function createRectangle(
x,
y,
w,
h
){


  let widget =
  hmUI.createWidget(

    hmUI.widget.FILL_RECT,

    {

      x:x,

      y:y,

      w:w,

      h:h,

      color:0x202020,

      radius:12

    }

  );


  widgets.push(widget);


}



// =====================
// TEXT
// =====================

function createText(
text,
x,
y,
w,
h,
size
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

      color:0xffffff,


      align_h:
      hmUI.align.CENTER_H,


      align_v:
      hmUI.align.CENTER_V

    }

  );


  widgets.push(widget);


}



// =====================
// DAY SELECT
// =====================

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

        x:45,

        y:80+(index*42),

        w:300,

        h:35,


        text:day.name,


        normal_color:0x333333,

        press_color:0x666666,


        radius:8,


        click_func:()=>{


          selectedDay=day;

          showSelectedDay();


        }


      }

    );


    widgets.push(button);


  });


}



// =====================
// LESSON SCREEN
// =====================

function showSelectedDay(){


  clearScreen();


  screen="lesson";



  createText(

    selectedDay.name,

    20,

    10,

    350,

    35,

    22

  );



  let currentMinutes;



  if(DEBUG_MODE){


    currentMinutes =
    toMinutes(DEBUG_TIME);


  }

  else{


    let now =
    new Date();


    currentMinutes =
    now.getHours()*60+
    now.getMinutes();


  }



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


  });



  // FINISHED

  if(

    currentMinutes >=
    toMinutes(
      periods[periods.length-1].end
    )

  ){


    createRectangle(
      15,
      80,
      360,
      120
    );


    createText(

      "School Finished",

      20,

      120,

      350,

      50,

      26

    );


    return;

  }



  // NOT STARTED

  if(

    currentMinutes <
    toMinutes(periods[0].start)

  ){


    createRectangle(
      15,
      80,
      360,
      120
    );


    createText(

      "School not started",

      20,

      120,

      350,

      50,

      24

    );


    return;

  }



  // CURRENT PERIOD FOUND

  if(currentIndex>=0){



let period = periods[currentIndex];

let isBreak =
    !period.subjectId ||
    period.subjectId === "BREAK";

let subject;

if (isBreak) {

    subject = {
        longName: "BREAK",
        abbreviation: "",
        room: "",
        teacher: ""
    };

} else {

    subject = getSubject(period.subjectId);

}



    // TOP CARD

    createRectangle(

      15,

      55,

      360,

      245

    );



    createText(

      "NOW",

      20,

      70,

      350,

      25,

      18

    );



    createText(

      subject.longName,

      20,

      105,

      350,

      45,

      30

    );



    if(SHOW_ABBREVIATION){


      createText(

        subject.abbreviation,

        20,

        150,

        350,

        25,

        20

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



    if(SHOW_ROOM){


      createText(

        "Room "+subject.room,

        20,

        220,

        350,

        25,

        18

      );


    }



    if(SHOW_TEACHER){


      createText(

        subject.teacher,

        20,

        250,

        350,

        25,

        16

      );


    }



    // NEXT CARD

    if(

      SHOW_NEXT_LESSON

      &&

      currentIndex+1 <
      periods.length

    ){


    
   let next = periods[currentIndex + 1];

let nextSubject;

if (!next.subjectId || next.subjectId === "BREAK") {

    nextSubject = {
        longName: "BREAK"
    };

} else {

    nextSubject = getSubject(next.subjectId);

}



      createRectangle(

        15,

        320,

        360,

        100

      );



      createText(

        "NEXT",

        20,

        330,

        350,

        20,

        16

      );



      createText(

        nextSubject.longName,

        20,

        360,

        350,

        30,

        22

      );


    }



    return;


  }



  // BREAK

  createRectangle(

    15,

    100,

    360,

    100

  );


  createText(

    "BREAK",

    20,

    130,

    350,

    40,

    26

  );


}



// =====================
// SUBJECT LOOKUP
// =====================

function getSubject(id){


  let subject =

  timetable.timetable.subjects.find(

    item=>

    item.id===id

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



// =====================
// TIME
// =====================

function toMinutes(time){


  let parts =
  time.split(":");


  return Number(parts[0])*60+
  Number(parts[1]);


}



// =====================
// BUTTONS
// =====================

onKey({

callback:(key,event)=>{


  if(event===1){


    if(key===36){


      if(screen==="lesson"){


        showDaySelection();


      }


    }



    if(key===93){


      if(screen==="lesson"){


        showSelectedDay();


      }


    }


  }


  return true;


}

});