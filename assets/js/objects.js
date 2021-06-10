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
  draw(ctx) {}
}

/**
 * Defines a player controlled paddle
 */
class Paddle extends GameObject {
  constructor(boundingBox) {
    super(boundingBox);
  }
}

/**
 * Defines a basic ball
 */
class Ball extends GameObject {
  constructor(boundingBox) {
    super(boundingBox);
  }
}
