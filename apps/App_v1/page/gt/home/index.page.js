import * as hmUI from "@zos/ui";
import { getDeviceInfo } from "@zos/device";
import { px } from "@zos/utils";

const CELL_COUNT = 7;
const GRID_W = CELL_COUNT * 2 + 1;
const GRID_H = CELL_COUNT * 2 + 1;
const WALL = 1;
const PATH = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createMaze() {
  const grid = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(WALL));

  for (let y = 1; y < GRID_H; y += 2) {
    for (let x = 1; x < GRID_W; x += 2) {
      grid[y][x] = PATH;
    }
  }

  function carve(cx, cy) {
    const directions = [
      { dx: 0, dy: -2 },
      { dx: 2, dy: 0 },
      { dx: 0, dy: 2 },
      { dx: -2, dy: 0 },
    ];
    shuffle(directions);

    for (const dir of directions) {
      const nx = cx + dir.dx;
      const ny = cy + dir.dy;

      if (nx > 0 && nx < GRID_W - 1 && ny > 0 && ny < GRID_H - 1 && grid[ny][nx] === WALL) {
        grid[cy + dir.dy / 2][cx + dir.dx / 2] = PATH;
        grid[ny][nx] = PATH;
        carve(nx, ny);
      }
    }
  }

  carve(1, 1);
  return grid;
}

Page({
  build() {
    const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo();
    const buttonSize = px(58);
    const buttonGap = px(8);
    const controlHeight = buttonSize * 2 + buttonGap * 2 + px(46) + px(58) + px(20);
    const mazeAreaHeight = DEVICE_HEIGHT - controlHeight - px(10);
    const cellSize = Math.max(14, Math.floor(Math.min(DEVICE_WIDTH, mazeAreaHeight) / GRID_W));
    const mazeWidth = cellSize * GRID_W;
    const mazeHeight = cellSize * GRID_H;
    const offsetX = Math.floor((DEVICE_WIDTH - mazeWidth) / 2);
    const offsetY = Math.floor((DEVICE_HEIGHT - mazeHeight - controlHeight) / 2);
    const controlsY = offsetY + mazeHeight + px(10);
    const centerX = Math.floor(DEVICE_WIDTH / 2);

    this.state = {
      grid: [],
      player: { x: 1, y: 1 },
      goal: { x: GRID_W - 2, y: GRID_H - 2 },
      cellSize,
      offsetX,
      offsetY,
      wallWidgets: [],
      playerWidget: null,
      goalWidget: null,
      statusWidget: null,
    };

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: DEVICE_WIDTH,
      h: DEVICE_HEIGHT,
      color: 0x000000,
    });

    this.state.wallWidgets = Array(GRID_H * GRID_W).fill(null).map((_, index) => {
      const x = index % GRID_W;
      const y = Math.floor(index / GRID_W);
      return hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: offsetX + x * cellSize,
        y: offsetY + y * cellSize,
        w: cellSize,
        h: cellSize,
        color: 0x000000,
      });
    });

    this.state.goalWidget = hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: offsetX + this.state.goal.x * cellSize,
      y: offsetY + this.state.goal.y * cellSize,
      w: cellSize,
      h: cellSize,
      color: 0x0000ff,
    });

    this.state.playerWidget = hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: offsetX + this.state.player.x * cellSize,
      y: offsetY + this.state.player.y * cellSize,
      w: cellSize,
      h: cellSize,
      color: 0x00ff00,
    });

    const buttonSize = px(58);
    const buttonGap = px(8);
    const buttonStyle = {
      w: buttonSize,
      h: buttonSize,
      radius: px(8),
      normal_color: 0x202020,
      press_color: 0x404040,
      text_size: px(24),
    };

    const move = (dx, dy) => {
      if (this.state.completed) {
        return;
      }
      const nextX = this.state.player.x + dx;
      const nextY = this.state.player.y + dy;
      if (
        nextX >= 0 &&
        nextX < GRID_W &&
        nextY >= 0 &&
        nextY < GRID_H &&
        this.state.grid[nextY][nextX] === PATH
      ) {
        this.state.player.x = nextX;
        this.state.player.y = nextY;
        this.updatePlayer();

        if (this.state.player.x === this.state.goal.x && this.state.player.y === this.state.goal.y) {
          this.state.completed = true;
          this.state.statusWidget.setProperty(hmUI.prop.MORE, {
            text: "Maze complete! Tap NEW MAZE.",
          });
        }
      }
    };

    const createControl = (x, y, label, dx, dy) => {
      hmUI.createWidget(hmUI.widget.BUTTON, {
        x,
        y,
        ...buttonStyle,
        text: label,
        click_func: () => move(dx, dy),
      });
    };

    createControl(centerX - buttonSize / 2, controlsY, "↑", 0, -2);
    createControl(centerX - buttonSize - buttonGap, controlsY + buttonSize + buttonGap, "←", -2, 0);
    createControl(centerX - buttonSize / 2, controlsY + buttonSize + buttonGap, "↓", 0, 2);
    createControl(centerX + buttonGap, controlsY + buttonSize + buttonGap, "→", 2, 0);

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: centerX - buttonSize * 1.1,
      y: controlsY + buttonSize * 2 + buttonGap * 3,
      w: buttonSize * 2.2,
      h: px(38),
      radius: px(8),
      normal_color: 0x0033aa,
      press_color: 0x0055dd,
      text: "NEW MAZE",
      text_size: px(16),
      click_func: () => this.resetMaze(),
    });

    this.state.statusWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      x: px(10),
      y: controlsY + buttonSize * 2 + buttonGap * 3 + px(50),
      w: DEVICE_WIDTH - px(20),
      h: px(54),
      color: 0xffffff,
      text: "Click arrows to move the green square through the maze.",
      text_size: px(14),
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_style: hmUI.text_style.WRAP,
    });

    this.resetMaze = () => {
      this.state.grid = createMaze();
      this.state.player = { x: 1, y: 1 };
      this.state.goal = { x: GRID_W - 2, y: GRID_H - 2 };
      this.state.completed = false;
      this.state.statusWidget.setProperty(hmUI.prop.MORE, {
        text: "Click arrows to move the green square through the maze.",
      });
      this.updateMaze();
      this.updatePlayer();
      this.updateGoal();
    };

    this.updateMaze = () => {
      this.state.wallWidgets.forEach((widget, index) => {
        const x = index % GRID_W;
        const y = Math.floor(index / GRID_W);
        const color = this.state.grid[y][x] === WALL ? 0xffffff : 0x000000;
        widget.setProperty(hmUI.prop.MORE, { color });
      });
    };

    this.updatePlayer = () => {
      this.state.playerWidget.setProperty(hmUI.prop.MORE, {
        x: offsetX + this.state.player.x * cellSize,
        y: offsetY + this.state.player.y * cellSize,
      });
    };

    this.updateGoal = () => {
      this.state.goalWidget.setProperty(hmUI.prop.MORE, {
        x: offsetX + this.state.goal.x * cellSize,
        y: offsetY + this.state.goal.y * cellSize,
      });
    };

    this.resetMaze();
  },
});