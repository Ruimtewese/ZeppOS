import * as hmUI from "@zos/ui";
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    COLORS,
    CONNECTION,
    COMMANDS
} from "../../../common/constants";

import {
    initCommunication,
    addListener,
    getState,
    sendCommand,
    clearLog
} from "../../../utils/communication";

Page({

    build() {

        initCommunication();

        // =========================
        // Background
        // =========================

        hmUI.createWidget(
            hmUI.widget.FILL_RECT,
            {
                x: 0,
                y: 0,
                w: SCREEN_WIDTH,
                h: SCREEN_HEIGHT,
                color: COLORS.BACKGROUND
            }
        );

        // =========================
        // Title
        // =========================

        hmUI.createWidget(
            hmUI.widget.TEXT,
            {
                x: 0,
                y: 18,
                w: SCREEN_WIDTH,
                h: 40,
                text: "Phone Test",
                color: COLORS.TEXT,
                text_size: 30,
                align_h: hmUI.align.CENTER_H
            }
        );

        // =========================
        // Connection Indicator
        // =========================

        const statusDot = hmUI.createWidget(
            hmUI.widget.FILL_RECT,
            {
                x: 25,
                y: 70,
                w: 16,
                h: 16,
                radius: 8,
                color: COLORS.ERROR
            }
        );

        const statusText = hmUI.createWidget(
            hmUI.widget.TEXT,
            {
                x: 50,
                y: 63,
                w: 300,
                h: 30,
                text: "Not Connected",
                color: COLORS.TEXT,
                text_size: 22
            }
        );

        // =========================
        // Last Command
        // =========================

        const commandText = hmUI.createWidget(
            hmUI.widget.TEXT,
            {
                x: 20,
                y: 105,
                w: 350,
                h: 30,
                text: "Last: None",
                color: COLORS.SUBTEXT,
                text_size: 20
            }
        );

        // =========================
        // Log
        // =========================

        const logWidget = hmUI.createWidget(
            hmUI.widget.TEXT,
            {
                x: 20,
                y: 150,
                w: 350,
                h: 120,
                text: "",
                color: COLORS.TEXT,
                text_size: 18
            }
        );

        // =========================
        // Send Hello Button
        // =========================

        hmUI.createWidget(
            hmUI.widget.BUTTON,
            {
                x: 70,
                y: 290,
                w: 250,
                h: 50,
                radius: 12,
                normal_color: COLORS.BUTTON,
                press_color: COLORS.BUTTON_PRESSED,
                text: "Send Hello",
                click_func: () => {
                    sendCommand(COMMANDS.HELLO);
                }
            }
        );

        // =========================
        // Clear Log Button
        // =========================

        hmUI.createWidget(
            hmUI.widget.BUTTON,
            {
                x: 70,
                y: 355,
                w: 250,
                h: 50,
                radius: 12,
                normal_color: 0x555555,
                press_color: 0x333333,
                text: "Clear Log",
                click_func: () => {
                    clearLog();
                }
            }
        );

        // =========================
        // Update UI
        // =========================

        function refresh() {

            const state = getState();

            statusDot.setProperty(
                hmUI.prop.MORE,
                {
                    color:
                        state.connectionState === CONNECTION.CONNECTED
                            ? COLORS.SUCCESS
                            : COLORS.ERROR
                }
            );

            statusText.setProperty(
                hmUI.prop.TEXT,
                state.connectionState === CONNECTION.CONNECTED
                    ? "Connected"
                    : "Not Connected"
            );

            commandText.setProperty(
                hmUI.prop.TEXT,
                `Last: ${state.lastCommand}`
            );

            logWidget.setProperty(
                hmUI.prop.TEXT,
                state.log.join("\n")
            );

        }

        addListener(refresh);

        refresh();

    }

});