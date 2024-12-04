import { Menu } from "./menu.js";
import { ScreenController } from "./screenController.js";

const menu = new Menu();
const screenController = new ScreenController(menu);

menu.addItems().then(() => {
  screenController.renderMenu();
});
screenController.init();