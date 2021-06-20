/*
 * Point2D class tests
 */
describe("Point2D", function() {
  let point;
  beforeEach(function() {
    point = new Point2D(1,5);
  });

  it("Should be created with correct values", function() {
    expect(point._x).toBe(1);
    expect(point._y).toBe(5);
  });

  it("Should copy with correct values", function() {
    const point2 = new Point2D(2,3);
    point2.copy(point);
    expect(point2._x).toBe(1);
    expect(point2._y).toBe(5);
  });

  describe("Accessors", function() {
    it("can get and set x", function() {
      expect(point.x).toBe(1);
      point.x = 3;
      expect(point.x).toBe(3);
    });
    it("can get and set y", function() {
      expect(point.y).toBe(5);
      point.y = 3;
      expect(point.y).toBe(3);
    });
  });

  describe("distanceTo", function() {
    it("can calculate the correct distance between points", function() {
       const point2 = new Point2D(1,6);
       expect(point.distanceTo(point2)).toBe(1);
    });
  });
});

/*
 * Vector2D class tests
 */
describe("Vector2D", function() {
  let vector;
  beforeEach(function() {
    vector = new Vector2D(1,5);
  });

  it("Should be created with correct values", function() {
    expect(vector._x).toBe(1);
    expect(vector._y).toBe(5);
  });

  describe("normalize", function() {
    it("can normalize vector", function() {
      let magnitude = Math.sqrt(vector._x * vector._x + vector._y * vector._y);
      expect(magnitude).not.toBe(1);
      vector.normalize();
      expect(Math.sqrt(vector._x * vector._x + vector._y * vector._y)).toBe(1);
    });
  });

});