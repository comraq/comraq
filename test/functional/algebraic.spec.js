import comraq from "./../../src";

const { concat, join } = comraq.functional.algebraic;

export default () => {
  const s1 = "aSdf";
  const s2 = "1234";

  const a1 = [ "a", "b" ];
  const a2 = [ false ];

  describe("semigroup:", () => {
    describe("concat:", () => {
      it("should concatenate two semigroups", () => {
        concat(s1)(s2).should.equal("aSdf1234");
        concat(a1, a2).should.deep.equal([ "a", "b", false ]);
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
