import comraq from "./../../src";

const { join } = comraq.functional.algebraic;
const { concat } = comraq.functional.transducers;

export default () => {
  const s1 = "aSdf";
  const s2 = "1234";

  const a1 = [ "a", "b" ];
  const a2 = [ false ];

  describe("semigroup:", () => {
    describe("concat:", () => {
      it("should concatenate two semigroups", () => {
        concat(s2)(s1).should.equal("aSdf1234");
        concat(a2, a1).should.deep.equal([ "a", "b", false ]);
      });
    });
  });

  describe("monad:", () => {
    describe("join:", () => {
      it("should join/flatten two monads", () => {
        expect.fail(join, null, "test not implemented");
      });
    });
  });
};
