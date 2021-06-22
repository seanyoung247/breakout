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
    it("detects collision", function() {
      let object2 = new TestGameObject(null, new BoundingBox(5,5,10,10));
      expect(object.collision(object2)).toBeTrue();
    });
    it("detects not collision", function() {
      let object2 = new TestGameObject(null, new BoundingBox(11,11,10,10));
      expect(object.collision(object2)).toBeFalse();
    });
  });

  describe("intersects", function() {
    it("detects intersection", function() {
      let object2 = new TestGameObject(null, new BoundingBox(5,5,10,10));
      expect(object.intersects(object2)).toBeTruthy();
    });
    it("detects non-intersection", function() {
      let object2 = new TestGameObject(null, new BoundingBox(12,12,10,10));
      expect(object.intersects(object2)).toBeFalsy();
    });
    it("detects axis of intersection", function() {
      let object2 = new TestGameObject(null, new BoundingBox(9,8,10,10));
      expect(object.intersects(object2)).toEqual({side: 'x', pos: 12});
    });
  });
});

/*
 * Block tests
 */
describe("Block", function() {
  let mockContext;
  let block;
  beforeEach(function() {
    mockContext = jasmine.createSpyObj("context", ["beginPath", "rect", "fill", "arc"]);
    block = new Block(null, new BoundingBox(1,1,100,50));
  });

  it("is created with correct values", function() {
    expect(block._alive).toBeTrue();
  });

  describe("Accessors", function() {
    it("can get alive state", function() {
      expect(block.isAlive).toBeTrue();
    });
    it("can not set alive state", function() {
      block.isAlive = false;
      expect(block.isAlive).toBeTrue();
    });
  });
});