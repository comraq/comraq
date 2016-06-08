import * as fl from "./../../src/functional/fantasy-land";

export default () => {
  const s1 = "aSdf";
  const s2 = "1234";

  const a1 = [ "a", "b" ];
  const a2 = [ false ];

  describe("semigroup:", () => {
    describe("concat:", () => {
      it("should concatenate two semigroups", () => {
        fl.concat(s2)(s1).should.equal("aSdf1234");
        fl.concat(a2, a1).should.deep.equal([ "a", "b", false]);
      });
    });
  });

  describe("monad:", () => {
    describe("join:", () => {
      it("should join/flatten two monads", () => {
        expect.fail(null, null, "test not implemented");
      });
    });
  });
};
