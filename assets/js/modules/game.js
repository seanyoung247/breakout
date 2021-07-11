/**
 * Defines the main game controller object. Manages game state, user input and
 * game objects.
 */
class Game {
  /**
   * Creates a game
   *  @param {Object} canvas - The canvas element for rendering
   */
  constructor(canvas) {
    this._canvas = canvas;
    this._thisFrameTime = 0;
    this._lastFrameTime = 0;
    this._demo = false;

    this._setupGame();
    this._setupEvents();

    // Start the game loop
    window.requestAnimationFrame((time)=>this.loop(time));
  }

  // Internal function to setup user interaction and events
  _setupEvents() {
    // Bind events
    document.addEventListener("keydown", (event)=>this.keyDown(event));
    document.addEventListener("keyup", (event)=>this.keyUp(event));
    document.addEventListener("mousemove", (event)=>this.mouseMove(event));

    // Maps game functions to input commands
    this._actionMap = {
      left: {down: false, up: false},
      right: {down: false, up: false},
      demo: {down: false, up: false}
    };
    this._actionMap.left.action = (...args)=>this._paddle.moveLeft(...args);
    this._actionMap.right.action = (...args)=>this._paddle.moveRight(...args);
    this._actionMap.demo.action = ()=>this._demo=!this._demo;

    // Maps keys to game input commands
    this._keyMap = new Map();
    this._keyMap.set("ArrowLeft", "left");
    this._keyMap.set("ArrowRight", "right");
    this._keyMap.set("KeyD", "demo");
  }

  // Internal function, Creates the game objects and starts the game loop
  _setupGame() {
    // Setup game variables
    this._lives = 3;
    this._score = 0;
    this._won = false;

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
            2 + (blockWidth + 4) * column,  // X position
            100 + (54 * row),               // Y position
            blockWidth, 50                  // Width and height
          )
        );
      }
    }
  }

  /**
   * Gets the paddle game object
   *  @return {Object} The current game's paddle object
   */
  get paddle() {
    return this._paddle;
  }
  /**
   * Gets the ball game object
   *  @return {Object} The current game's ball object
   */
  get ball() {
    return this._ball;
  }
  /**
   * Gets the blocks game object
   *  @return {Object} The current game's blocks object
   */
  get blocks() {
    return this._blocks;
  }

  // Internal Function. Starts the frame and logs the frame time
  _startFrame(time) {
    // Calculate the time since the last frame
    this._thisFrameTime = time - this._lastFrameTime;
    return this._thisFrameTime;
  }

  // Internal Function. Checks victory condition
  _checkVictory() {
    let blockCount = 0;
    for (let row = 0; row < this._blocks.length; row++) {
      for (let column = 0; column < this._blocks[row].length; column++) {
        blockCount += this._blocks[row][column].isAlive;
      }
    }
    this._won = (blockCount <= 0);
  }

  // Internal Function. Updates the game state on each frame
  _update(time) {
    if (this._lives > 0 && !this._won) {
      // React to user input
      if (this._actionMap.left.down) {
        this._actionMap.left.action(this._bounds, time);
      }
      if (this._actionMap.right.down) {
        this._actionMap.right.action(this._bounds, time);
      }
      if (this._actionMap.demo.down) {
        this._actionMap.demo.action();
      }
      // If in demo mode move the paddle to the ball
      if (this._demo) {
        const x = this._ball.dimensions.x - this._paddle.dimensions.width / 2;
        this._paddle.setPosInBounds(this._bounds, x);
      }
      // Move the ball
      this._ball.move(this._bounds, time);
      // Check for victory
      this._checkVictory();
    }
  }

  // Internal Function. Draws the frame to the screen
  _drawFrame(time) {
    // Get the drawing context
    const ctx = this._canvas.getContext("2d");
    // Clear the screen
    ctx.fillStyle = "black";
    ctx.rect(0,0,this._canvas.width,this._canvas.height);
    ctx.fill();

    // Set the screen draw colour
    ctx.fillStyle = "white";

    // Draw the blocks
    for (let row = 0; row < this._blocks.length; row++) {
      for (let column = 0; column < this._blocks[row].length; column++) {
        this._blocks[row][column].draw(ctx);
      }
    }

    // Draw the Paddle and Ball
    this._paddle.draw(ctx);
    // Hide the ball if the game isn't actively playing
    if (this._lives > 0 && !this._won) this._ball.draw(ctx);

    // Draw score
    ctx.font = "48px 'Press Start 2P'";
    ctx.textAlign = "start";
    ctx.fillText(this._score, 15, 58);

    // Draw remaining lives
    for (let i = 0; i < this._lives; i++) {
      let x = (this._canvas.width - 15) - (30 * i);
      ctx.beginPath();
      ctx.arc(x, 25, 12.5, 0, 2 * Math.PI);
      ctx.fill();
    }

    if (this._lives <= 0) {
      // Draw game lost text
      ctx.textAlign = "center";
      ctx.font = "32px 'Press Start 2P'";
      ctx.fillText("Game over!", this._canvas.width / 2, this._canvas.height / 2);
    } else if (this._won) {
      // Draw the game won text
      ctx.textAlign = "center";
      ctx.font = "32px 'Press Start 2P'";
      ctx.fillText("You Won!", this._canvas.width / 2, this._canvas.height / 2);
    }
  }
  // Internal Function. Ends this frame and logs end time
  _endFrame(time) {
    this._lastFrameTime = time;
  }

  /*
   * Game state
   */
  /**
   * Decrements the lives counter and sets the ball and paddle
   * back to default position.
   */
  loseALife() {
    this._lives--;
    if (this._lives > 0) {
      // Reset paddle position
      this._paddle.dimensions.x = (this._canvas.width / 2) - 75;
      this._paddle.dimensions.y = this._canvas.height - 30;
      // Reset the ball position and vector
      this._ball.dimensions.x = (this._canvas.width / 2) - 12.5;
      this._ball.dimensions.y = this._canvas.height - 55;
      this._ball.vector.x = 150;
      this._ball.vector.y = -300;
    }
  }

  /**
   * Increments the score counter
   */
  increaseScore() {
    this._score++;
  }

  /**
   * Runs the game loop. Should only be called via requestAnimationFrame
   *  @param {number} time - current time in miliseconds
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
    if (this._lives > 0 && !this._won && !this._demo) {
      const x = event.clientX - this._paddle.dimensions.width / 2;
      this._paddle.setPosInBounds(this._bounds, x);
    }
  }
}

export { Game };
