/**
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

/**
 * Defines the base functionality of interactive game objects
 */
class GameObject extends AbstractClass {
  constructor(boundingBox) {
    super(GameObject);
    this._box = boundingBox;
  }
  update(timeDelta) {this.AbstractMethod("update");}
  draw(ctx) {this.AbstractMethod("draw");}
}

/**
 * Defines a destroyable block
 */
class Block extends GameObject {
  constructor(boundingBox) {
    super(boundingBox);
  }
  update(timeDelta) {}
  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this._box.x, this._box.y, this._box.width, this._box.height);
    ctx.fill();
  }
}

/**
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
  update(timeDelta) {

  }
}

/**
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
  update(timeDelta) {

  }
  draw(ctx) {

  }
}
