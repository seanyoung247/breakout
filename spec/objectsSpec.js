/*
 * GameObject tests
 */
describe("GameObject", function() {
  it("can't be created", function() {
    expect(() => new GameObject()).toThrowError(
      TypeError, 'Abstract class "GameObject" cannot be instantiated directly');
  });

});