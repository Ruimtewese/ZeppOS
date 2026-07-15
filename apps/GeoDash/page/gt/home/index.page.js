import * as hmUI from "@zos/ui";

import { Game } from "../../../engine/game.js";

Page({

    build() {

        hmUI.setStatusBarVisible(false);

        const game = new Game();

        game.start();

    }

});

