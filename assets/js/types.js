/*
 * Models a point in 2D space
 */
class Point2D {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
  // Getters and Setters
  get x() {
    return this._x;
  }
  set x(val) {
    this._x = val;
  }
  get y() {
    return this._y;
  }
  set y(val) {
    this._y = val;
  }
  // Copies one point to another
  copy(point) {
    this._x = point._x;
    this._y = point._y;
  }
  // Calculates the distance between two points
  distanceTo(point) {
    const x = point._x - this._x;
    const y = point._y - this._y;
    return Math.sqrt( (x * x) + (y * y) );
  }
}

/*
 * Models a 2D vector
 */
class Vector2D extends Point2D {
  constructor(x, y) {
    super(x, y);
  }
  // Normaizes this vector. A normalized vector is one with a magnitude of 1.
  normalize() {
    const mag = this.magnitude;
    this._x /= mag;
    this._y /= mag;
  }
  // Returns the euclidean distance (length) of this vector
  get magnitude() {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }
  set magnitude(val) {
    // First reset the length of the vector to 1
    this.normalize();
    //Then multiply it by it's new magnitude
    this._x *= val;
    this._y *= val;
  }
  // Converts to and from angular vector notation
  get radian() {
    return Math.atan2(this._y, this._x);
  }
  set radian(val) {
    this._x = Math.cos(val);
    this._y = Math.sin(val);
  }
  // Methods to rotate a vector
  rotate(x, y, direction = -1) {
    const tX = this._x * x + (this._y * direction) * y;
    const tY = (this._x * y + (this._y * direction) * x) * direction;
    this._x = tX;
    this._y = tY;
  }
  rotateByRadians(radians) {
    this.rotate(
      Math.cos(radians),
      Math.sin(radians)
    );
  }
  rotateByVector(vector) {
    this.rotate(vector._x, vector._y);
  }
  // Subtractive Rotate
  unrotateByRadians(radians) {
    this.rotate(
      Math.cos(radians),
      Math.sin(radians), 1
    );
  }
  unrotateByVector(vector) {
    this.rotate(vector._x, vector._y, 1);
  }
}

/*
 * Defines a rectanglular region in 2D space that can collide and detect collision
 * Implements an Axis Aligned Bounding Box (AABB)
 */
class BoundingBox {
  constructor(x, y, width, height) {
    this._x = x;
    this._y = y;
    this._w = width;
    this._h = height;
  }
  copy(box) {
    this._x = box._x;
    this._y = box._y;
    this._w = box._w;
    this._h = box._h;
  }
  get x() {
    return this._x;
  }
  set x(val) {
    this._x = val;
  }
  get y() {
    return this._y;
  }
  set y(val) {
    this._y = val;
  }
  get width() {
    return this._w;
  }
  set width(val) {
    this._w = val;
  }
  get height() {
    return this._h;
  }
  set height(val) {
    this._h = val;
  }
  // Checks whether the point is within the box boundary
  pointInBounds(point) {
    return this.inBounds(point._x, point._y);
  }
  // Checks whether the x,y co-ordinate passed is within the box boundary
  inBounds(x, y) {
    if (x >= this._x && y >= this._y &&
        x <= (this._x + this._w) &&
        y <= (this._y + this._h)) {
      return true;
    }
    return false;
  }
  // Checks whether any part of boundingBox passed is colliding with this one,
  // (partial collision).
  collides(box) {
    if (this._x < box._x + box._w &&
        this._x + this._w > box._x &&
        this._y < box._y + box._h &&
        this._y + this._h > box._y) {
      return true;
    }
    return false;
  }
  // A more rigorous collision test. Returns null for no collision,
  // Otherwise returns a
  intersects(box) {
    // Find the amount of intersection for the left and right sides
    const x1 = (box._x + box._w) - this._x;
    const x2 = (this._x + this._w) - box._x;
    let x = 0, xPos = 0;
    // Find the closest side
    if (x1 < x2) {
      x = x1;
      xPos = this._x - (box._w + 1);
    } else {
      x = x2;
      xPos = this._x + this._w + 1;
    }
    // If x is negative there's no collision in x which means
    // the boxes aren't intersecting
    if (x < 0) return null;
    // Find the amount of intersection for the top and bottom sides
    const y1 = (box._y + box._h) - this._y;
    const y2 = (this._y + this._h) - box._y;
    let y = 0, yPos = 0;
    if (y1 < y2) {
      y = y1;
      yPos = this._y - (box._h + 1);
    } else {
      y = y2;
      yPos = this._y + this._h + 1;
    }
    if (y < 0) return null;
    // Find the closest side
    if (x < y) {
      // x collision
      return {side: 'x', pos: xPos};
    } else {
      return {side: 'y', pos: yPos};
    }
  }

  // Checks the entire boundingBox passed is inside this one (complete collision)
  contains(box) {
    if (this._x < box._x && this._y < box._y &&
        this._x + this._w > box._x + box._w &&
        this._y + this._h > box._y + box._h) {
      return true;
    }
    return false;
  }
}
