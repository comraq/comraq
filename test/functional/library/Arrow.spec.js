import comraq from "./../../../src";

import {
  triple, inc5, inc10
} from "./../../test-data";

const { Arrow } = comraq.functional.library;
const { Functor } = comraq.functional.categories;

export default () => {
  describe("of:", () => {
    it("should return an Arrow instance", () => {
      const arr = Arrow.of("anything");
      arr.should.be.an.instanceof(Arrow);
    });

    it("returned arrow instance should return contained value "
       + "when called as a function", () => {
      const value = {};

      const arr = Arrow.of(value);

      arr().should.equal(value);
    });
  });

  describe("lift:", () => {
    it("should lift a regular function into an Arrow instance", () => {
      const arr = Arrow.lift(() => {});
      arr.should.be.an.instanceof(Arrow);
    });

    it("should throw error if non-function is passed", () => {
      expect(Arrow.lift).to.throw(/.*/);
      expect(Arrow.lift.bind(null, "a string")).to.throw(/.*/);
    });

    it("should not mutate the original function", () => {
      const arr = Arrow.lift(triple);
      arr.should.not.equal(triple);
    });

    it("lifted instance should return results as normal if called", () => {
      const arrTriple = Arrow.lift(triple);
      arrTriple(10).should.equal(30);
    });
  });

  it("should also be functions", () => {
    const arr = Arrow.of("anything");

    arr.should.be.a("function");
  });

  it("instances are functors", () => {
    const arr = Arrow.of(null);

    arr.should.be.an.instanceof(Functor);
    arr.fmap.should.be.a("function");
    arr.should.be.an.instanceof(Arrow);
  });

  it("can apply functions to contained value via fmap", () => {
    const arr = Arrow.of(2);
    const willReturn6 = arr.fmap(triple);

    willReturn6().should.equal(6);

    const willReturn11 = willReturn6.fmap(inc5);
    willReturn11().should.equal(11);
  });

  it("can pipe regular functions by lift then fmap", () => {
    const arr = Arrow.lift(inc5);
    const add5Times3 = arr.fmap(triple);

    add5Times3(2).should.equal(21);

    const add5Times3Add10 = add5Times3.fmap(inc10);
    add5Times3Add10(2).should.equal(31);

    Arrow.lift( inc5 ).fmap( triple ).fmap( inc10 )(2).should.equal(31);
  });
};
