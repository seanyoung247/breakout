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
  constructor(boundingBox) {
    super(GameObject);
    this._box = boundingBox;
  }
  draw(ctx) {this.AbstractMethod("draw");}
}

/*
 * Defines a destroyable block
 */
class Block extends GameObject {
  constructor(boundingBox) {
    super(boundingBox);
    this._alive = true;
  }
  draw(ctx) {
    if (this._alive) {
      ctx.beginPath();
      ctx.rect(this._box.x, this._box.y, this._box.width, this._box.height);
      ctx.fill();
    }
  }
}

/*
 * Defines a player controlled paddle
 */
class Paddle extends Block {
  constructor(boundingBox, speed) {
    super(boundingBox);
    // Speed the paddle can move in pixels a second
    this._speed = speed;
  }
  get speed() {
    return this._speed;
  }
  set speed(val) {
    this._speed = val;
  }
  move(timeDelta, direction) {
    this._box.x = this._box.x + ((this._speed / timeDelta) * direction);
  }
}

/*
 * Defines a basic ball
 */
class Ball extends GameObject {
  constructor(boundingBox, initalVector) {
    super(boundingBox);
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
}
