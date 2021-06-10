/**
 * Defines the main game controller object. Manages game state, user input and
 * game objects.
 */
class Game {
  constructor(canvas) {
    this._canvas = canvas;
    this._thisFrameTime = 0;
    this._lastFrameTime = 0;
    let ctx = this._canvas.getContext("2d");
    // Create the player paddle
    this._paddle = new Paddle(
      new BoundingBox(
        (ctx.canvas.width / 2) - 50,
        ctx.canvas.height - 30,
        100,
        25
      ), 50
    );
  }
  startFrame(time) {
    // Stores the time since the last frame
    this._thisFrameTime = time - this._lastFrameTime;
    return this._thisFrameTime;
  }
  drawScene() {}
  endFrame(time) {
    this._lastFrameTime = time;
  }
  /**
   * Encapsulates the game loop
   */
  update(time) {
    startFrame(time);
    // Game Logic goes here
    drawScene();
    endFrame(time);
    window.requestAnimationFrame(this.update);
  }
}
