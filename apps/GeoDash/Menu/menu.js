import { MainMenu } from "./mainMenu.js";
import { Game } from "../Engine/game.js";

export class Menu {

    start() {

        this.mainMenu = new MainMenu(() => {

            const game = new Game();
            game.start();

        });

    }

}