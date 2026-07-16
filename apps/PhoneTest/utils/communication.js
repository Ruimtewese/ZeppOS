import { CONNECTION } from "../common/constants";

// =========================
// State
// =========================

let connectionState = CONNECTION.DISCONNECTED;

let lastCommand = "None";

let log = [];

let listeners = [];

// =========================
// Private
// =========================

function notify() {
    listeners.forEach(listener => {
        listener({
            connectionState,
            lastCommand,
            log
        });
    });
}

function addLog(text) {

    const time = new Date();

    const stamp =
        `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}`;

    log.unshift(`${stamp}  ${text}`);

    if (log.length > 20) {
        log.pop();
    }

    notify();
}

// =========================
// Public API
// =========================

export function initCommunication() {

    connectionState = CONNECTION.DISCONNECTED;

    lastCommand = "None";

    log = [];

    addLog("Communication initialized");

}

export function addListener(callback) {

    listeners.push(callback);

}

export function removeListener(callback) {

    listeners = listeners.filter(item => item !== callback);

}

export function getState() {

    return {

        connectionState,

        lastCommand,

        log

    };

}

export function setConnectionState(state) {

    connectionState = state;

    addLog(
        state === CONNECTION.CONNECTED
            ? "Phone connected"
            : state === CONNECTION.CONNECTING
                ? "Connecting..."
                : "Phone disconnected"
    );

}

export function sendCommand(command) {

    lastCommand = command;

    addLog(`Sent: ${command}`);

    // -------------------------------------------------
    // REAL PHONE COMMUNICATION WILL GO HERE LATER
    // -------------------------------------------------

    notify();

}

export function receiveCommand(command) {

    lastCommand = command;

    addLog(`Received: ${command}`);

    notify();

}

export function clearLog() {

    log = [];

    addLog("Log cleared");

}