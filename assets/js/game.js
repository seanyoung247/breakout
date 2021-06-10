/**
 * Defines the main game controller object. Manages game state, user input and
 * game objects.
 */
class Game {
  constructor() {
    this._thisFrameTime = 0;
    this._lastFrameTime = 0;
  }
  startFrame(time) {
    // Stores the time since the last frame
    this._thisFrameTime = time - this._lastFrameTime;
    return this._thisFrameTime;
  }
  drawScence() {}
  endFrame(time) {
    this._lastFrameTime = time;
  }
  update() {}
}