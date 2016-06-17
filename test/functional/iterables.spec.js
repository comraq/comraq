import * as I from "./../../src/functional/iterables";

export default () => {
  describe("getIterator:", () => {
    it("should return an iterator", () => {
      I.getIterator([]).next.should.be.a("Function");
    });
  });

  describe("reverse:", () => {
    it("should return an iteratable which "
       + "will iterate in the reverse order", () =>  {
      expect.fail(null, null, "test not yet implemented");
    });
  });

  describe("reduce:", () => {
    it("should return a function when iterable is not provided", () => {
      expect.fail(null, null, "test not yet implemented");
    });
  });
};
