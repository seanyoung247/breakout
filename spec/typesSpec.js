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
      expect(magnitude).not.toBeCloseTo(1);
      vector.normalize();
      expect(Math.sqrt(vector._x * vector._x + vector._y * vector._y)).toBeCloseTo(1);
    });
  });

  describe("Accessors", function() {
    it("can get and set magnitude", function() {
      // Get magnitude
      let magnitude = Math.sqrt(vector._x * vector._x + vector._y * vector._y);
      expect(vector.magnitude).toBeCloseTo(magnitude);
      // Set magnitude
      vector.magnitude = 10;
      magnitude = Math.sqrt(vector._x * vector._x + vector._y * vector._y);
      expect(magnitude).toBeCloseTo(10);
    });
    it("can get and set radian angles", function() {
      // Get radians
      let radians = Math.atan2(vector._y, vector._x);
      expect(vector.radians).toBeCloseTo(radians);
      // Set radians
      vector.radians = Math.atan2(0,-1);
      expect(vector._x).toBeCloseTo(-1);
      expect(vector._y).toBeCloseTo(0);
    });
  });

  describe("Rotation", function() {
    function testRotation(x, y) {
      let value = {};
      value.x = vector._x * x - vector._y * y;
      value.y = vector._x * y + vector._y * x;
      return value;
    }

    function testUnrotation(x, y) {
      let value = {};
      value.x = vector._x * x + vector._y * y;
      value.y = vector._y * x - vector._x * y;
      return value;
    }
    function degreesToRadian(degrees) {
      return degrees * Math.PI / 180;
    }

    it("can rotate", function() {
      // Anti-clockwise (additive) rotation
      let testValue = testRotation(2,1);
      vector.rotate(2,1,1);
      expect(vector._x).toBeCloseTo(testValue.x);
      expect(vector._y).toBeCloseTo(testValue.y);
      // Clockwise (subtractive) rotation
      testValue = testUnrotation(2,1);
      vector.rotate(2,1,-1);
      expect(vector._x).toBeCloseTo(testValue.x);
      expect(vector._y).toBeCloseTo(testValue.y);
    });

    it("can rotate by radians", function() {
      const radians = degreesToRadian(45);
      // Anti-clockwise (additive) rotation
      let testValue = testRotation(Math.cos(radians), Math.sin(radians));
      vector.rotateByRadians(radians);
      expect(vector._x).toBeCloseTo(testValue.x);
      expect(vector._y).toBeCloseTo(testValue.y);
      // Clockwise (subtractive) rotation
      testValue = testUnrotation(Math.cos(radians), Math.sin(radians));
      vector.unrotateByRadians(radians);
      expect(vector._x).toBeCloseTo(testValue.x);
      expect(vector._y).toBeCloseTo(testValue.y);
    });

    it("can rotate by vectors", function() {
      const vector2 = new Vector2D(
        Math.cos(degreesToRadian(45)),
        Math.sin(degreesToRadian(45))
      );
      // Anti-clockwise (additive) rotation
      let testValue = testRotation(vector2._x, vector2._y);
      vector.rotateByVector(vector2);
      expect(vector._x).toBeCloseTo(testValue.x);
      expect(vector._y).toBeCloseTo(testValue.y);
      // Clockwise (subtractive) rotation
      testValue = testUnrotation(vector2._x, vector2._y);
      vector.unrotateByVector(vector2);
      expect(vector._x).toBeCloseTo(testValue.x);
      expect(vector._y).toBeCloseTo(testValue.y);
    });
  });
});

describe("BoundingBox", function() {
  let box1;
  let box2;
  let box3;
  beforeEach(function() {
    box1 = new BoundingBox(1,1,100,100);
    box2 = new BoundingBox(50,102,75,75);
    box3 = new BoundingBox(1,101,150,150);
  });

  it("Should be created with correct values", function() {
    expect(box1._x).toBe(1);
    expect(box1._y).toBe(1);
    expect(box1._w).toBe(100);
    expect(box1._h).toBe(100);
  });

  it("Should copy with correct values", function() {
    box1.copy(box2);
    expect(box1._x).toBe(50);
    expect(box1._y).toBe(102);
    expect(box1._w).toBe(75);
    expect(box1._h).toBe(75);
  });

  describe("Accessors", function() {
    it("can get and set width", function() {
      expect(box1.width).toBe(100);
      box1.width = 200;
      expect(box1.width).toBe(200);
    });

    it("can get and set height", function() {
      expect(box1.height).toBe(100);
      box1.height = 200;
      expect(box1.height).toBe(200);
    });
  });

  describe("Point collision tests", function() {
    it("detects points in bounds", function() {
      let point = new Point2D(25,25);
      expect(box1.inBounds(25,25)).toBeTrue();
      expect(box1.pointInBounds(point)).toBeTrue();
    });
    it("detects points out of bounds", function() {
      let point = new Point2D(200,200);
      expect(box1.inBounds(200,200)).toBeFalse();
      expect(box1.pointInBounds(point)).toBeFalse();
    });
  });

});
