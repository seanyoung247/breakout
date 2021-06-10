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
    // Ensure the canvas fills the viewport
    this._canvas.width = this._viewport.clientWidth;
    this._canvas.height = this._viewport.clientHeight;
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
    // Get the drawing context
    const ctx = this._canvas.getContext("2d");
    // Clear the screen
    ctx.fillStyle = "#000000";
    ctx.rect(0,0,this._canvas.width,this._canvas.height);
    ctx.fill();
  }
  endFrame(time) {
    this._lastFrameTime = time;
  }
  /**
   * Encapsulates the game loop
   */
  update(time) {
    // If the screen size has changed restart the game
    if (this._canvas.width != this._viewport.clientWidth ||
        this._canvas.height != this._viewport.clientHeight) {
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
