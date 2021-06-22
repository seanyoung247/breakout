/*
 * GameObject tests
 */
describe("GameObject", function() {
  class TestGameObject extends GameObject {
    constructor(game, box) {super(game, box);}
  }

  let object;
  beforeEach(function() {
    object = new TestGameObject(null, new BoundingBox(1,1,10,10));
  });

  it("can't be created", function() {
    expect(() => new GameObject()).toThrowError(
      TypeError, 'Abstract class "GameObject" cannot be instantiated directly');
  });

  describe("draw", function() {
    it("enforces draw method definition", function() {
      expect(() => object.draw(null)).toThrowError(TypeError);
    });
  });

  describe("collision", function() {

  });

  describe("intersects", function() {

  });
});