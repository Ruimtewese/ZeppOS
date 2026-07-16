import { getDeviceInfo } from "@zos/device";

const device = getDeviceInfo();

export const SCREEN_WIDTH = device.width;
export const SCREEN_HEIGHT = device.height;

// =========================
// Colors
// =========================

export const COLORS = {
    BACKGROUND: 0x000000,

    HEADER: 0x00AEEF,

    TEXT: 0xFFFFFF,

    SUBTEXT: 0xAAAAAA,

    SUCCESS: 0x00FF00,

    ERROR: 0xFF4444,

    BUTTON: 0x2E86DE,

    BUTTON_PRESSED: 0x1B4F72,

    PANEL: 0x1C1C1C,

    BORDER: 0x444444
};

// =========================
// Layout
// =========================

export const HEADER_HEIGHT = 50;

export const BUTTON_WIDTH = 250;
export const BUTTON_HEIGHT = 55;
export const BUTTON_RADIUS = 12;

export const PANEL_RADIUS = 12;

export const MARGIN = 15;

export const STATUS_DOT_SIZE = 14;

// =========================
// Fonts
// =========================

export const FONT_TITLE = 30;

export const FONT_NORMAL = 22;

export const FONT_SMALL = 18;

// =========================
// Connection States
// =========================

export const CONNECTION = {

    DISCONNECTED: 0,

    CONNECTING: 1,

    CONNECTED: 2

};

// =========================
// Commands
// =========================

export const COMMANDS = {

    HELLO: "HELLO",

    PING: "PING",

    GET_TIME: "GET_TIME",

    CLEAR_LOG: "CLEAR_LOG"

};