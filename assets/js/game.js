/**
 * Defines the main game controller object. Manages game state, user input and
 * game objects.
 */
class Game {
  constructor(canvas) {
    this._canvas = canvas;
    this._thisFrameTime = 0;
    this._lastFrameTime = 0;
    this.setupGame();
  }
  setupGame() {
    // Ensure the canvas context width matches it's dom width
    this._canvas.width = this._canvas.scrollWidth;
    this._canvas.height = this._canvas.scrollHeight;
    // Create the screen bounding box
    this._bounds = new BoundingBox(0, 0, this._canvas.width, this._canvas.height);

    // Create the player paddle
    this._paddle = new Paddle(
      new BoundingBox(
        (this._canvas.width / 2) - 75,
        this._canvas.height - 30,
        150, 25
      ), 50
    );
    // Create the ball
    this._ball = new Ball(
      new BoundingBox(
        (this._canvas.width / 2) - 7.5, this._canvas.height - 55, 25, 25
      ),
      new Vector2D(0.5,-1)
    );
    // Create the blocks
    // Calculate how many rows
    // Calculate how many blocks per row
    // Calculate extra space at the edges

    // Start the game loop
    this.loop(performance.now());
  }
  startFrame(time) {
    // Stores the time since the last frame
    this._thisFrameTime = time - this._lastFrameTime;
    return this._thisFrameTime;
  }
  drawFrame() {
    // Get the drawing context
    const ctx = this._canvas.getContext("2d");
    // Clear the screen
    ctx.fillStyle = "black";
    ctx.rect(0,0,this._canvas.width,this._canvas.height);
    ctx.fill();
    // Draw the game objects in a fetching retro green
    ctx.fillStyle = "#00FF00";
    this._paddle.draw(ctx);
    this._ball.draw(ctx);
  }
  endFrame(time) {
    this._lastFrameTime = time;
  }
  /**
   * Encapsulates the game loop
   */
  loop(time) {
    // If the screen size has changed restart the game
    if (this._canvas.width != this._canvas.scrollWidth ||
        this._canvas.height != this._canvas.scrollHeight) {
      this.setupGame();
    } else {
      // Convert time in milliseconds to seconds
      let timeDelta = time / 1000;
      this.startFrame(time);
      // Game Logic goes here
      this.drawFrame()
      this.endFrame(time);
    }
    window.requestAnimationFrame(()=>this.loop());
  }
}
