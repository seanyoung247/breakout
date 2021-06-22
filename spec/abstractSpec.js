describe("AbstractClass", function() {
  class TestBaseClass extends AbstractClass {
    constructor() {super(TestBaseClass);}
    testMethod() {this.AbstractMethod("testMethod");}
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

});