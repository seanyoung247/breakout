/**
 * Defines the main game controller object. Manages game state, user input and
 * game objects.
 */
class Game {
  constructor(canvas, viewport) {
    this._canvas = canvas;
    this._viewport = viewport;
    this._thisFrameTime = 0;
    this._lastFrameTime = 0;
    this.setupGame();
  }
  setupGame() {
    // Create the screen bounding box
    this._bounds = new BoundingBox(0, 0, this._canvas.width, this._canvas.height);
    // Create the player paddle
    this._paddle = new Paddle(
      new BoundingBox(
        (this._canvas.width / 2) - 50,
        this._canvas.height - 30,
        150,
        25
      ), 50
    );
    // Start the game loop
    this.update(performance.now());
  }
  startFrame(time) {
    // Stores the time since the last frame
    this._thisFrameTime = time - this._lastFrameTime;
    return this._thisFrameTime;
  }
  drawScene() {
    
  }
  endFrame(time) {
    this._lastFrameTime = time;
  }
  /**
   * Encapsulates the game loop
   */
  update(time) {
    // Ensure the canvas fills the viewport
    this._canvas.width = this._viewport.clientWidth;
    this._canvas.height = this._viewport.clientHeight;
    // If the screen size has changed restart the game
    if (this._bounds.width != this._canvas.width ||
        this._bounds.height != this._canvas.height) {
      this.setupGame();
    } else {
      // Convert time in milliseconds to seconds
      let timeDelta = time / 1000;
      this.startFrame(time);
      // Game Logic goes here
      this.drawScene()
      this.endFrame(time);
    }
    window.requestAnimationFrame(()=>this.update());
  }
}
