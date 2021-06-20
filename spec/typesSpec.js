/*
 * Point2D class tests
 */
describe("Point2D", function() {
  let point;
  beforeEach(function() {
    point = new Point2D(1,5);
  });

  it("Should be created with correct values", function() {
    expect(point.x).toBe(1);
    expect(point.y).toBe(5);
  });
});
