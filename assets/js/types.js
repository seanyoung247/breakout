/**
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
