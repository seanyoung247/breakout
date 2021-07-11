
 //Needing to import types indicates that the tests aren't properly isolated...
import { Point2D, Vector2D, BoundingBox } from "../assets/js/modules/types.js";
import { GameObject, Block, Paddle, Ball } from "../assets/js/modules/objects.js";

/*
 * GameObject tests
 */
function GameObject_Tests() {
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
}

/*
 * Block tests
 */
function Block_Tests() {
  let mockContext;
  let block;
  beforeEach(function() {
    mockContext = jasmine.createSpyObj(
      "CanvasRenderingContext2D", ["beginPath", "rect", "fill", "arc"]);
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
      expect(()=>{block.isAlive = false;}).toThrow();
    });
  });

  describe("draw", function() {
    it("can be called", function() {
      expect(() => block.draw(mockContext)).not.toThrow();
    });
    it("does nothing if dead", function() {
      block._alive = false;
      block.draw(mockContext);
      expect(mockContext.fill).not.toHaveBeenCalled();
    });
  });

  describe("Collision", function() {
    it("detects collision", function() {
      let block2 = new Block(null, new BoundingBox(5,5,100,50));
      expect(block.collision(block2)).toBeTrue();
    });
    it("detects non-collision", function() {
      let block2 = new Block(null, new BoundingBox(102,150,100,50));
      expect(block.collision(block2)).toBeFalse();
    });
    it("dies on collision", function() {
      let block2 = new Block(null, new BoundingBox(5,5,100,50));
      block.collision(block2);
      expect(block._alive).toBeFalse();
    });
    it("does nothing if dead", function() {
      spyOn(GameObject.prototype, 'collision');
      let block2 = new Block(null, new BoundingBox(5,5,100,50));
      expect(GameObject.prototype.collision).not.toHaveBeenCalled();
    });
  });

  describe("Intersection", function() {
    it("detects intersection", function() {
      let block2 = new Block(null, new BoundingBox(5,5,100,50));
      expect(block.intersects(block2)).toBeTruthy();
    });
    it("detects non-intersection", function() {
      let block2 = new Block(null, new BoundingBox(102,150,100,50));
      expect(block.intersects(block2)).toBeFalsy();
    });
    it("detects axis of intersection", function() {
      let block2 = new Block(null, new BoundingBox(5,5,100,50));
      expect(block.intersects(block2)).toEqual({side: "y", pos: 52})
    });
    it("dies on intersection", function() {
      let block2 = new Block(null, new BoundingBox(5,5,100,50));
      block.intersects(block2);
      expect(block._alive).toBeFalse();
    });
    it("does nothing if dead", function() {
      spyOn(GameObject.prototype, 'intersects');
      let block2 = new Block(null, new BoundingBox(5,5,100,50));
      expect(GameObject.prototype.intersects).not.toHaveBeenCalled();
    });
  });
}

/*
 * Paddle tests
 */
function Paddle_Tests() {
  let mockContext;
  let paddle;
  beforeEach(function() {
    mockContext = jasmine.createSpyObj(
      "CanvasRenderingContext2D", ["beginPath", "rect", "fill", "arc"]);
    paddle = new Paddle(null, new BoundingBox(1,1,100,50), 50);
  });

  it("is created with correct values", function() {
    expect(paddle._speed).toBe(50);
  });

  describe("Accessors", function() {
    it("can get paddle speed", function() {
      expect(paddle.speed).toBe(50);
    });
    it("can set paddle speed", function() {
      paddle.speed = 100;
      expect(paddle._speed).toBe(100);
    });
  });

  describe("draw", function() {
    it("can be called", function() {
      expect(() => paddle.draw(mockContext)).not.toThrow();
    });
  });

  describe("setPosInBounds", function() {
    it("sets x to new value in boundary", function() {
      let bounds = new BoundingBox(0,0,500,500);
      paddle.setPosInBounds(bounds, 10);
      expect(paddle._box.x).toBe(10);
    });
    it("clamps x to boundary", function() {
      let bounds = new BoundingBox(0,0,500,500);
      paddle.setPosInBounds(bounds, -5);
      expect(paddle._box.x).toBe(0);
      paddle.setPosInBounds(bounds, 550);
      expect(paddle._box.x).toBe(400);
    });
  });

  describe("moveLeft", function() {
    let bounds;
    let time;
    beforeEach(function() {
      bounds = new BoundingBox(0,0,500,500);
      time = 0.5;
    });
    it("moves left", function() {
      paddle._box.x = 50;
      paddle.moveLeft(bounds, time);
      expect(paddle._box.x).toBeCloseTo(25);
    });
    it("clamps to boundary", function() {
      paddle.moveLeft(bounds, time);
      expect(paddle._box.x).toBe(0);
    });
  });

  describe("moveRight", function() {
    let bounds;
    let time;
    beforeEach(function() {
      bounds = new BoundingBox(0,0,500,500);
      time = 0.5;
    });
    it("moves right", function() {
      paddle._box.x = 50;
      paddle.moveRight(bounds, time);
      expect(paddle._box.x).toBeCloseTo(75);
    });
    it("clamps to boundary", function() {
      paddle._box.x = 400;
      paddle.moveRight(bounds, time);
      expect(paddle._box.x).toBe(400);
    });
  });
}

/*
 * Ball tests
 */
function Ball_Tests() {
  let mockContext;
  let mockGame;
  let ball;
  beforeEach(function() {
    mockContext = jasmine.createSpyObj(
      "CanvasRenderingContext2D", ["beginPath", "rect", "fill", "arc"]);
    mockGame = jasmine.createSpyObj(
      "Game", ["loseALife", "increaseScore"],
      {
        paddle: new Paddle(null, new BoundingBox(11,450,100,50), 50),
        blocks: [[new Block(null, new BoundingBox(1,1,100,50))]]
      }
    );
    ball = new Ball(
      mockGame, new BoundingBox(250,250,25,25), new Vector2D(50, -100));
  });

  it("is created with correct values", function() {
    expect(ball._vector.x).toBe(50);
    expect(ball._vector.y).toBe(-100);
  });

  describe("Accessors", function() {
    it("can get vector", function() {
      let test = new Vector2D(50, -100);
      expect(ball.vector).toEqual(test);
    });
    it("can not set vector", function() {
      let test = new Vector2D(500, -500);
      expect(()=>{ball.vector = test}).toThrow();
    });
  });

  describe("draw", function() {
    it("can be called", function() {
      expect(() => ball.draw(mockContext)).not.toThrow();
    });
  });

  describe("move", function() {
    let bounds;
    let time;
    beforeEach(function() {
      bounds = new BoundingBox(0,0,500,500);
      time = 0.5;
    });

    it("can move", function() {
      ball.move(bounds, time);
      expect(ball._box.x).toEqual(275);
      expect(ball._box.y).toEqual(200);
    });

    it("stays in bounds", function() {
      ball._box._x = 490;
      ball._box._y = 10;
      ball.move(bounds, time);
      expect(ball._box.x).toEqual(475);
      expect(ball._box.y).toEqual(0);
    });

    it("loses lives", function() {
      // Don't lose a life if not hitting the bottom
      ball.move(bounds, time);
      expect(mockGame.loseALife).not.toHaveBeenCalled();
      // Lose a life when hitting the bottom
      ball.vector.y = 100;
      ball._box.y = 490;
      ball.move(bounds, time);
      expect(mockGame.loseALife).toHaveBeenCalled();
    });

    it("collides", function() {
      ball.vector.y = 100;
      ball._box.x = 10;
      ball._box.y = 400;
      ball.move(bounds, time);
      // Ball was stopped by paddle
      expect(ball._box.x).toBe(35);
      expect(ball._box.y).toBe(424);
      // Ball bounced off of paddle
      expect(ball.vector.y).toBe(-100);
    });

    it("increases score", function() {
      ball._box.x = 10;
      ball._box.y = 65;
      ball.move(bounds, time);
      // Ball was stopped by paddle
      expect(ball._box.x).toBe(35);
      expect(ball._box.y).toBe(52);
      // Ball bounced off of paddle
      expect(ball.vector.y).toBe(100);
      // Hitting a block increases score
      expect(mockGame.increaseScore).toHaveBeenCalled();
      // Hitting a block 'kills it'
      expect(mockGame.blocks[0][0].isAlive).toBeFalse();
    });
  });
}

export { GameObject_Tests, Block_Tests, Paddle_Tests, Ball_Tests };
