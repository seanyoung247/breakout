
import { BoundingBox } from "./types.js";

class MenuItem {
  constructor(text, action) {
    this._text = text;
    this._action = action;
    this._selected = false;
  }
}

class Menu {
  constructor() {
    this._items = new Array();
    this._show = false;
  }
  addItem(text, action) {
    this._items.push(new MenuItem(text, action))
  }
  show() {
    this._show = true;
  }
  hide() {
    this._show = false;
  }
}

export { Menu };
