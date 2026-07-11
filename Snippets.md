# Zepp OS (Amazfit Bip 6) Development Cheat Sheet

## Imports

### UI
```javascript
import * as hmUI from "@zos/ui";
```

### Device Information
```javascript
import { getDeviceInfo } from "@zos/device";
```

### Logging
```javascript
import { log as Logger } from "@zos/utils";

const logger = Logger.getLogger("AppName");

logger.log("Hello");
```

### Sensors
```javascript
import { Accelerometer, Gyroscope } from "@zos/sensor";
```

---

# Basic App Structure

```javascript
Page({
  build() {

  }
});
```

---

# Hide Status Bar

```javascript
hmUI.setStatusBarVisible(false);
```

---

# Text Widget

## Create Text

```javascript
let textWidget = hmUI.createWidget(
  hmUI.widget.TEXT,
  {
    x: 0,
    y: 0,
    w: 480,
    h: 50,
    text: "Hello",
    text_size: 30,
    color: 0xffffff,
    align_h: hmUI.align.CENTER_H
  }
);
```

## Update Text

```javascript
textWidget.setProperty(
  hmUI.prop.TEXT,
  "New Text"
);
```

---

# Rectangle

## Create Rectangle

```javascript
let rect = hmUI.createWidget(
  hmUI.widget.FILL_RECT,
  {
    x: 100,
    y: 100,
    w: 50,
    h: 50,
    color: 0xff0000
  }
);
```

## Move Rectangle

```javascript
rect.setProperty(
  hmUI.prop.X,
  200
);

rect.setProperty(
  hmUI.prop.Y,
  200
);
```

---

# Remove Widget

```javascript
widget.remove();
```

---

# Colors

```javascript
const WHITE = 0xffffff;
const BLACK = 0x000000;
const RED = 0xff0000;
const GREEN = 0x00ff00;
const BLUE = 0x0000ff;
const YELLOW = 0xffff00;
const ORANGE = 0xff8800;
const PURPLE = 0x8800ff;
const CYAN = 0x00ffff;
```

---

# Variables

## Changeable

```javascript
let score = 0;
let playerX = 100;
```

## Constant

```javascript
const SPEED = 5;
const WIDTH = 480;
```

---

# Math

## Round Number

```javascript
Math.round(value);
```

## Decimal Places

```javascript
value.toFixed(1);
```

## Random Number

```javascript
Math.random();
```

## Random Range

```javascript
Math.floor(
  Math.random() * 100
);
```

---

# Timer / Game Loop

```javascript
let timer = setInterval(() => {

  // Update game

}, 50);
```

50ms = 20 FPS

## Stop Timer

```javascript
clearInterval(timer);
```

---

# Accelerometer

Permission:

```json
"device:os.accelerometer"
```

Code:

```javascript
const accel = new Accelerometer();

accel.onChange(() => {

  const data = accel.getCurrent();

  let x = data.x;
  let y = data.y;
  let z = data.z;

});

accel.start();
```

---

# Gyroscope

Permission:

```json
"device:os.gyroscope"
```

Code:

```javascript
const gyro = new Gyroscope();

gyro.onChange(() => {

  const data = gyro.getCurrent();

  let x = data.x;
  let y = data.y;
  let z = data.z;

});

gyro.start();
```

---

# Touch Button

```javascript
hmUI.createWidget(
  hmUI.widget.BUTTON,
  {
    x:100,
    y:100,
    w:200,
    h:60,
    text:"Press",

    click_func(){

      // Button pressed

    }
  }
);
```

---

# Conditions

```javascript
if(score > 10){

}
else{

}
```

---

# Loops

## For Loop

```javascript
for(let i = 0; i < 10; i++){

}
```

## While Loop

```javascript
while(condition){

}
```

---

# Objects

```javascript
let player = {

  x:240,
  y:240,
  size:20,
  speed:5

};
```

Use:

```javascript
player.x += player.speed;
```

---

# Arrays

Create:

```javascript
let walls = [];
```

Add:

```javascript
walls.push({

 x:100,
 y:100,
 w:20,
 h:20

});
```

---

# Collision Detection

```javascript
if(
player.x < wall.x + wall.w &&
player.x + player.w > wall.x &&
player.y < wall.y + wall.h &&
player.y + player.h > wall.y
){

// Collision

}
```

---

# Clamp Values

Keep a number between limits:

```javascript
value = Math.max(
  min,
  Math.min(max,value)
);
```

Example:

```javascript
player.x = Math.max(
0,
Math.min(460,player.x)
);
```

---

# Delay

```javascript
setTimeout(() => {

},1000);
```

1000 = 1 second

---

# Game Object Example

```javascript
let player = {

 x:240,
 y:240,
 size:20,
 speed:5

};


function update(){

 player.x += player.speed;

}


setInterval(update,50);
```

---

# App Permissions

```json
{
"permissions":[

"device:os.accelerometer",
"device:os.gyroscope",
"device:os.local_storage"

]
}
```

---

# Zeus Commands

Install packages:

```bash
npm install
```

Build:

```bash
zeus build
```

Run development mode:

```bash
zeus dev
```

Check version:

```bash
zeus --version
```

---

# Useful Game Variables

```javascript
const SCREEN_WIDTH = 480;
const SCREEN_HEIGHT = 480;

let score = 0;
let level = 1;

let gameRunning = true;

let player = {

 x:240,
 y:240,
 w:20,
 h:20,
 speed:5

};
```

---

# Recommended Game Loop

```javascript
function update(){

 // Read sensors

 // Move player

 // Check collision

 // Update screen

}


setInterval(update,50);
```