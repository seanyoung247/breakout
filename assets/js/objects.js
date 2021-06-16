/**
 * Enforces the abstract class paradigm
 */
class AbstractClass {
  /**
   * Ensures the class being created is a derived class not a base class
   *  @param {Object} BaseClass - The baseclass that is abstract
   */
  constructor(BaseClass) {
    this._baseClass = BaseClass;
    if (this.constructor === AbstractClass) {
      throw new TypeError('Abstract class "AbstractClass" cannot be instantiated directly');
    }
    if (this.constructor === this._baseClass) {
      throw new TypeError(`Abstract class "${this._baseClass.name}" cannot be instantiated directly`);
    }
  }
  /**
   * Raises an error if an abstract base class method is called
   *  @param {string} methodName - The name of the method that is abstract
   */
  AbstractMethod(methodName) {
    throw new TypeError(
      `${this._baseClass.name}: Abstract method "${methodName}" not overridden by derived class "${this.constructor.name}".`
    );
  }
}

/**
 * Defines the base functionality of interactive game objects
 *  @extends AbstractClass
 */
class GameObject extends AbstractClass {
  /**
   * Creates a base GameObject
   *  @param {Object} game - The game manager class
   *  @param {Object} boundingBox - Initial size and position of this GameObject
   */
  constructor(game, boundingBox) {
    super(GameObject);
    this._game = game;
    this._box = boundingBox;
  }
  /**
   * Gets the bounding box dimensions of this Object
   *  @return {Object} This GameObject's BoundingBox
   */
  get dimensions() {
    return this._box;
  }
  /**
   * Abstract interface definition for the draw method.
   * Must be overridden in derived classes.
   */
  draw(ctx) {this.AbstractMethod("draw");}
  /**
   * Simple collision test between this GameObject and another
   *  @param {Object} object - The GameObject to check for intersection
   *  @return {boolean} true/false if colliding
   */
  collision(object) {
    return this._box.collides(object._box);
  }
  /**
   * Performs a comprehensive collision test that checks where the two objects are
   * overlapping and indicates the closest point to move them out of collision.
   *  @param {Object} object - The object to check for intersection
   *  @return {Object} a dictionary with side: axis of intersection and
   *                     pos: closest point of non-intersection
   */
  intersects(object) {
    return this._box.intersects(object._box);
  }
}

/**
 * Defines a destroyable block
 *  @extends GameObject
 */
class Block extends GameObject {
  /**
   * Creates a Block
   *  @param {Object} game - The game manager class
   *  @param {Object} boundingBox - Initial size and position of this Block
   */
  constructor(game, boundingBox) {
    super(game, boundingBox);
    this._alive = true;
  }
  /**
   * Gets whether this Block is still alive
   *  @return {boolean} True/False if the Block is still alive
   */
  get isAlive() {
    return this._alive;
  }
  /**
   * Draws this block on the screen
   *  @param {Object} ctx - The Canvas rendering context to draw to.
   */
  draw(ctx) {
    if (this._alive) {
      ctx.beginPath();
      ctx.rect(this._box.x, this._box.y, this._box.width, this._box.height);
      ctx.fill();
    }
  }
  /**
   * Simple collision test between this GameObject and another
   *  @param {Object} object - The GameObject to check for intersection
   *  @return {boolean} true/false if colliding
   */
  collision(object) {
    let collision = false;
    // Only check collisions if the block is still alive
    if (this._alive) {
      collision = super.collision(object);
      this._alive = !collision;
    }
    return collision;
  }
  /**
   * Performs a comprehensive collision test that checks where the two objects are
   * overlapping and indicates the closest point to move them out of collision.
   *  @param {Object} object - The object to check for intersection
   *  @return {Object} a dictionary with side: axis of intersection and
   *                     pos: closest point of non-intersection
   */
  intersects(object) {
    let collision = false;
    // Only check collisions if the block is still alive
    if (this._alive) {
      collision = super.intersects(object);
      if (collision) this._alive = false;
    }
    return collision;
  }
}

/**
 * Defines a player controlled paddle
 *  @extends GameObject
 */
class Paddle extends GameObject {
  /**
   * Creates a Paddle
   *  @param {Object} game - The game manager class
   *  @param {Object} boundingBox - Initial size and position of this Paddle
   *  @param {number} speed - The movement speed of this paddle in pixels a second
   */
  constructor(game, boundingBox, speed) {
    super(game, boundingBox);
    // Speed the paddle can move in pixels a second
    this._speed = speed;
  }
  /**
   * Gets this Paddles current movement speed
   *  @return {number} The movement speed of this Paddle
   */
  get speed() {
    return this._speed;
  }
  /**
   * Sets the Paddle's movement speed
   *  @param {number} val - The new movement speed
   */
  set speed(val) {
    this._speed = val;
  }
  /**
   * Draws this Paddle on the screen
   *  @param {Object} ctx - The Canvas rendering context to draw to.
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this._box.x, this._box.y, this._box.width, this._box.height);
    ctx.fill();
  }
  /**
   * Sets the x position of this Paddle while keeping it within the boundary passed
   *  @param {object} bounds - BoundingBox the Paddle should stay within
   *  @param {number} x - The new x coordinate
   */
  setPosInBounds(bounds, x) {
    // Clamp to the left side of the screen
    if (x < bounds.x) {
      x = bounds.x;
    }
    // Clamp to the right side of the screen
    if (x + this._box.width > bounds.x + bounds.width) {
      x = bounds.width - this._box.width;
    }
    this._box.x = x;
  }
  // Generalised movement function, for internal use
  _move(bounds, timeDelta, direction) {
    this.setPosInBounds(bounds, this._box.x + ((this._speed * timeDelta) * direction));
  }
  /**
   * Moves the paddle left based on it's speed and the time since the last update
   *  @param {Objects} bounds - BoundingBox the Paddle should stay within
   *  @param {number} timeDelta - The time in seconds since the last update
   */
  moveLeft(bounds, timeDelta) {
    this._move(bounds, timeDelta, -1);
  }
  /**
   * Moves the paddle right based on it's speed and the time since the last update
   *  @param {Objects} bounds - BoundingBox the Paddle should stay within
   *  @param {number} timeDelta - The time in seconds since the last update
   */
  moveRight(bounds, timeDelta) {
    this._move(bounds, timeDelta, 1);
  }
}

/**
 * Defines a basic ball
 *  @extends GameObject
 */
class Ball extends GameObject {
  /**
   * Creates a Ball
   *  @param {Object} game - The game manager class
   *  @param {Object} boundingBox - Initial size and position of this Ball
   *  @param {Object} initalVector - Initial movement vector of the Ball
   */
  constructor(game, boundingBox, initalVector) {
    super(game, boundingBox);
    this._vector = initalVector;
  }
  /**
   * Gets this Ball's current movement vector
   *  @return {Object} The current movement Vector2D
   */
  get vector() {
    return this._vector;
  }
  /**
   * Draws this Ball on the screen
   *  @param {Object} ctx - The Canvas rendering context to draw to.
   */
  draw(ctx) {
    // Calculate the center point from the BoundingBox
    let cX = this._box.x + this._box.width / 2;
    let cY = this._box.y + this._box.height / 2;
    // Draw the circle. Assumes height === width
    ctx.beginPath();
    ctx.arc(cX, cY, this._box.width / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  /**
   * Moves the ball based on it's movement vector and the time since the last update
   *  @param {Object} bounds - BoundingBox the Ball should stay within
   *  @param {number} timeDelta - The time in seconds since the last update
   */
  move(bounds, timeDelta) {
    // Calculate new position
    this._box.x = this._box.x + (this.vector.x * timeDelta);
    this._box.y = this._box.y + (this.vector.y * timeDelta);

    // Check the ball will still be in bounds
    if (this._box.x < bounds.x) {
      // Hit the left side of the screen
      this._box.x = bounds.x;
      this._vector.x = -this._vector.x;
    }
    if (this._box.x + this._box.width > bounds.x + bounds.width) {
      // Hit the right side of the screen
      this._box.x = bounds.x + (bounds.width - this._box.width);
      this._vector.x = -this._vector.x;
    }
    if (this._box.y < bounds.y) {
      // Hit the top of the screen
      this._box.y = bounds.y;
      this._vector.y = -this._vector.y;
    }
    if (this._box.y + this._box.height > bounds.y + bounds.height) {
      // Hit the bottom of the screen
      // Lose a life and reset paddle and ball position
      game.loseALife();
    }

    // Check for collision with the paddle
    let collision = game.paddle.intersects(this);
    if (collision) {
      this._box[collision.side] = collision.pos;
      this._vector[collision.side] = -this._vector[collision.side];
    }
    // Check for collisions with the blocks
    const blocks = game.blocks;
    for (let row = 0; row < blocks.length; row++) {
      for (let column = 0; column < blocks[row].length; column++) {
        collision = blocks[row][column].intersects(this);
        if (collision) {
          this._box[collision.side] = collision.pos;
          this._vector[collision.side] = -this._vector[collision.side];
          // Increment the score counter
          game.increaseScore();
        }
      }
    }
  }
}
