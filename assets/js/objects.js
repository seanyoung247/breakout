/*
 * Enforces the abstract class
 */
class AbstractClass {
  constructor(BaseClass) {
    this._baseClass = BaseClass;
    if (this.constructor === AbstractClass) {
      throw new TypeError('Abstract class "AbstractClass" cannot be instantiated directly');
    }
    if (this.constructor === this._baseClass) {
      throw new TypeError(`Abstract class "${this._baseClass.name}" cannot be instantiated directly`);
    }
  }
  AbstractMethod(methodName) {
    throw new TypeError(
      `${this._baseClass.name}: Abstract method "${methodName}" not overridden by derived class "${this.constructor.name}".`
    );
  }
}

/*
 * Defines the base functionality of interactive game objects
 */
class GameObject extends AbstractClass {
  constructor(game, boundingBox) {
    super(GameObject);
    this._game = game;
    this._box = boundingBox;
  }
  get dimensions() {
    return this._box;
  }
  set dimensions(val) {
    this._box = val
  }
  draw(ctx) {this.AbstractMethod("draw");}
  collision(object) {
    return this._box.collides(object._box);
  }
}

/*
 * Defines a destroyable block
 */
class Block extends GameObject {
  constructor(game, boundingBox) {
    super(game, boundingBox);
    this._alive = true;
  }
  draw(ctx) {
    if (this._alive) {
      ctx.beginPath();
      ctx.rect(this._box.x, this._box.y, this._box.width, this._box.height);
      ctx.fill();
    }
  }
  collision(object) {
    let collision = false;
    // Only check collisions if the block is still alive
    if (this._alive) {
      collision = super.collision(object);
    }
    return collision;
  }
}

/*
 * Defines a player controlled paddle
 */
class Paddle extends GameObject {
  constructor(game, boundingBox, speed) {
    super(game, boundingBox);
    // Speed the paddle can move in pixels a second
    this._speed = speed;
  }
  get speed() {
    return this._speed;
  }
  set speed(val) {
    this._speed = val;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this._box.x, this._box.y, this._box.width, this._box.height);
    ctx.fill();
  }
  setXinBounds(bounds, x) {
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
  _move(bounds, timeDelta, direction) {
    this.setXinBounds(bounds, this._box.x + ((this._speed * timeDelta) * direction));
  }
  moveLeft(bounds, timeDelta) {
    this._move(bounds, timeDelta, -1);
  }
  moveRight(bounds, timeDelta) {
    this._move(bounds, timeDelta, 1);
  }
}

/*
 * Defines a basic ball
 */
class Ball extends GameObject {
  constructor(game, boundingBox, initalVector) {
    super(game, boundingBox);
    this._vector = initalVector;
  }
  get vector() {
    return this._vector;
  }
  set vector(val) {
    this._vector = val;
  }
  draw(ctx) {
    // Calculate the center point from the BoundingBox
    let cX = this._box.x + this._box.width / 2;
    let cY = this._box.y + this._box.height / 2;
    // Draw the circle. Assumes height === width
    ctx.beginPath();
    ctx.arc(cX, cY, this._box.width / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
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
    // Check for object collisions

    // Set the ball to the new location
  }
}
