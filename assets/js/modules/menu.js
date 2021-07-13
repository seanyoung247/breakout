
import { BoundingBox } from "./types.js";

class MenuItem {
  constructor(text, action) {
    this._text = text;
    this._action = action;
    this._selected = false;
  }
  get text() {
    return this._text;
  }
  set text(val) {
    this._text = val;
  }
}

class Menu {
  constructor() {
    this._items = new Array();
    this._show = false;
  }

  addItem(text, action) {
    this._items.push(new MenuItem(text, action))
    return this._items.length - 1;
  }

  removeItem(id) {

  }

  show() {
    this._show = true;
  }

  hide() {
    this._show = false;
  }

  draw(ctx) {
    if (this._show) {

    }
  }
}

export { MenuItem, Menu };
