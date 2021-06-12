/*
 * Defines the main game controller object. Manages game state, user input and
 * game objects.
 */
class Game {
  constructor(canvas) {
    this._canvas = canvas;
    this._thisFrameTime = 0;
    this._lastFrameTime = 0;
    this.setupEvents();
    this.setupGame();
  }

  /*
   * Attaches
   */
  setupEvents() {
    document.addEventListener("keydown", (event)=>this.keyDown(event), false);
    document.addEventListener("keyup", (event)=>this.keyUp(event), false);
  }

  /*
   * Creates the game objects and starts the game loop
   */
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
        (this._canvas.width / 2) - 12.5, this._canvas.height - 55, 25, 25
      ),
      new Vector2D(0.5,-1)
    );

    // Calculate how many blocks per row
    /* The minimum width of a block is 100px with 2px margins.
       Calculate the maximum number of minimum sized blocks that
       can fit on a row */
    const blocksPerRow = Math.floor(this._canvas.width / 104);

    /* Calculate the actual width the blocks have to be to fill
       the entire screen width */
    const blockWidth = (this._canvas.width / blocksPerRow) - 4;

    // Create the blocks
    this._blocks = new Array(3);
    for (let row = 0; row < 3; row++) {
      this._blocks[row] = new Array(blocksPerRow);
      for (let column = 0; column < blocksPerRow; column++) {
        this._blocks[row][column] = new Block(
          new BoundingBox(
            2 + (blockWidth + 4) * column, // X position
            100 + (54 * row),                // Y position
            blockWidth, 50                  // Width and height
          )
        );
      }
    }

    // Start the game loop
    this.loop(performance.now());
  }

  /*
   * User interaction
   */
  keyDown(event) {
    switch(event.keyCode) {
      case 37:  // Left Arrow Key
        this._paddle.move(this._thisFrameTime, -1);
        break;

      case 39:  // Right Arrow Key
        this._paddle.move(this._thisFrameTime, 1);
        break;
    }
  }

  keyUp(event) {}

  /*
   * Frame update and draw
   */
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

    ctx.fillStyle = "white";
    this._paddle.draw(ctx);
    this._ball.draw(ctx);
    // Draw the blocks
    for (let row = 0; row < this._blocks.length; row++) {
      for (let column = 0; column < this._blocks[row].length; column++) {
        this._blocks[row][column].draw(ctx);
      }
    }
  }

  endFrame(time) {
    this._lastFrameTime = time;
  }

  /*
   * Runs the game loop
   */
  loop(time) {
    // If the screen size has changed restart the game
    if (this._canvas.width != this._canvas.scrollWidth ||
        this._canvas.height != this._canvas.scrollHeight) {
      this.setupGame();
    } else {
      let timeDelta = this.startFrame(time) / 1000;
      this.update(timeDelta)
      this.drawFrame(timeDelta)
      this.endFrame(time);
    }
    window.requestAnimationFrame((time)=>this.loop(time));
  }
}
