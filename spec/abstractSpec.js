/*
 * AbstractClass tests
 */
describe("AbstractClass", function() {
  class TestBaseClass extends AbstractClass {
    constructor() {super(TestBaseClass);}
    testMethod() {this.AbstractMethod("testMethod");}
  }
  class TestFailClass extends TestBaseClass {
    constructor() {super();}
  }
  class TestClass extends TestBaseClass {
    constructor() {super();}
    testMethod() {/* Do nothing */}
  }

  it("can't be created", function() {
    expect(() => new AbstractClass(null)).toThrowError(
      TypeError,'Abstract class "AbstractClass" cannot be instantiated directly');
  });

  it("base class can't be created", function() {
    expect(() => new TestBaseClass()).toThrowError(
      TypeError, 'Abstract class "TestBaseClass" cannot be instantiated directly');
  });

  it("derived class can be created", function() {
    expect(() => new TestClass()).not.toThrowError(TypeError);
  });

  describe("AbstractMethod", function() {
    it("can't be called", function() {
      let test = new TestFailClass();
      expect(() => test.testMethod()).toThrowError(TypeError,
        'TestBaseClass: Abstract method "testMethod" not overridden by derived class "TestFailClass".');
    });
    it("can be overridden", function() {
      let test = new TestClass();
      expect(() => test.testMethod()).not.toThrowError(TypeError);
    });
  });
});
