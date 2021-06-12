/*
 * Defines the main game controller object. Manages game state, user input and
 * game objects.
 */
class Game {
  constructor(canvas) {
    this._canvas = canvas;
    this._thisFrameTime = 0;
    this._lastFrameTime = 0;

    this._setupGame();
    this._setupEvents();

    // Start the game loop
    window.requestAnimationFrame((time)=>this.loop(time));
  }

  /*
   * Getters for the game objects
   */
  get paddle() {
    return this._paddle;
  }

  get ball() {
    return this.ball;
  }

  get blocks() {
    return this.blocks;
  }

  /*
   * Sets up user interaction and events
   */
  _setupEvents() {
    // Bind events
    document.addEventListener("keydown", (event)=>this.keyDown(event));
    document.addEventListener("keyup", (event)=>this.keyUp(event));
    document.addEventListener("mousemove", (event)=>this.mouseMove(event));

    // Maps game functions to input commands
    this._actionMap = {
      left: {down: false, up: false},
      right: {down: false, up: false}
    };
    this._actionMap.left.action = (...args)=>this._paddle.moveLeft(...args);
    this._actionMap.right.action = (...args)=>this._paddle.moveRight(...args);

    // Maps keys to game input commands
    this._keyMap = new Map();
    this._keyMap.set("ArrowLeft", "left");
    this._keyMap.set("ArrowRight", "right");
  }

  /*
   * Creates the game objects and starts the game loop
   */
  _setupGame() {
    // Ensure the canvas context width matches it's dom width
    this._canvas.width = this._canvas.scrollWidth;
    this._canvas.height = this._canvas.scrollHeight;
    // Create the screen bounding box
    this._bounds = new BoundingBox(0, 0, this._canvas.width, this._canvas.height);

    // Create the player paddle
    this._paddle = new Paddle(
      this,
      new BoundingBox(
        (this._canvas.width / 2) - 75,
        this._canvas.height - 30,
        150, 25
      ), 500
    );

    // Create the ball
    this._ball = new Ball(
      this,
      new BoundingBox(
        (this._canvas.width / 2) - 12.5, this._canvas.height - 55, 25, 25
      ),
      new Vector2D(150,-300)
    );

    // Calculate how many blocks per row
    /* The minimum width of a block is 100px with 2px margins.
       Calculate the maximum number of minimum sized blocks that
       can fit on a row */
    const blocksPerRow = Math.floor(this._canvas.width / 104);

    /* Calculate the actual width the blocks have to be to fill
       the screen */
    const blockWidth = (this._canvas.width / blocksPerRow) - 4;

    // Create the blocks
    this._blocks = new Array(3);
    for (let row = 0; row < 3; row++) {
      this._blocks[row] = new Array(blocksPerRow);

      for (let column = 0; column < blocksPerRow; column++) {
        this._blocks[row][column] = new Block(
          this,
          new BoundingBox(
            2 + (blockWidth + 4) * column, // X position
            100 + (54 * row),                // Y position
            blockWidth, 50                  // Width and height
          )
        );
      }
    }
  }

  /*
   * Frame _update and draw methods
   */
  _startFrame(time) {
    // Calculate the time since the last frame
    this._thisFrameTime = time - this._lastFrameTime;
    return this._thisFrameTime;
  }

  _update(time) {
    // React to user input
    if (this._actionMap.left.down) {
      this._actionMap.left.action(this._bounds, time);
    }
    if (this._actionMap.right.down) {
      this._actionMap.right.action(this._bounds, time);
    }
    // Move the ball
    this._ball.move(this._bounds, time);
  }

  _drawFrame(time) {
    // Get the drawing context
    const ctx = this._canvas.getContext("2d");
    // Clear the screen
    ctx.fillStyle = "black";
    ctx.rect(0,0,this._canvas.width,this._canvas.height);
    ctx.fill();

    // Draw the game objects
    ctx.fillStyle = "white";

    // Draw the blocks
    for (let row = 0; row < this._blocks.length; row++) {
      for (let column = 0; column < this._blocks[row].length; column++) {
        this._blocks[row][column].draw(ctx);
      }
    }

    // Draw the Paddle and Ball
    this._paddle.draw(ctx);
    this._ball.draw(ctx);
  }

  _endFrame(time) {
    this._lastFrameTime = time;
  }

  /*
   * Runs the game loop
   */
  loop(time) {
    // If the screen size has changed restart the game
    if (this._canvas.width != this._canvas.scrollWidth ||
        this._canvas.height != this._canvas.scrollHeight) {
      this._setupGame();
    // Otherwise _update the game state and draw the frame
    } else {
      // Time since the last frame in seconds
      let timeDelta = this._startFrame(time) / 1000;

        this._update(timeDelta);
        this._drawFrame(timeDelta);

      this._endFrame(time);
    }
    window.requestAnimationFrame((time)=>this.loop(time));
  }

  /*
   * Player interaction
   */
  keyDown(event) {
    const key = this._keyMap.get(event.code);
    if (key) {
      this._actionMap[key].down = true;
      this._actionMap[key].up = false;
    }
  }

  keyUp(event) {
    const key = this._keyMap.get(event.code);
    if (key) {
      this._actionMap[key].down = false;
      this._actionMap[key].up = true;
    }
  }

  mouseMove(event) {
    const x = event.clientX - this._paddle.dimensions.width / 2;
    this._paddle.setXinBounds(this._bounds, x);
  }
}
