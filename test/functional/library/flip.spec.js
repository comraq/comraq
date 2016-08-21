import comraq from "./../../../src";

import { toArray } from "./../../test-data";

const {
  flip,
  isCurried,
  curry,
  getArity,
  placeholder: __
} = comraq.functional.library;

export default () => {
  it("should return a function", () => {
    flip(() => {}).should.be.a("function");
  });

  it("should throw an error if non-function is passed", () => {
    expect(flip.bind(null, "not a function")).to.throw(/.*/);
  });

  it("should preserve the 'curried' status of the original function", () => {
    const flipped = flip(toArray);
    const flippedC = flip(curry(toArray));

    isCurried(flipped).should.be.false;
    isCurried(flippedC).should.be.true;
  });

  it("should return a function with the sequence of only the first "
     + "two arguments flipped", () => {
    const array = [ null, true, "third arg", 4 ];
    const flipped = flip(toArray);

    flipped(...array).should.eql([ true, null, "third arg", 4 ]);
  });

  it("should returned curried function with same arity", () => {
    const flipped = flip(curry(toArray, 3));

    getArity(flipped).should.equal(3);
    flipped("second", "first")("third", "fourth")
      .should.eql([ "first", "second", "third" ]);
  });

  it("flipped curried functions should is unaware of placeholders and will"
     + "flip placeholder arguments if passed as one of "
     + "the first two arguments", () => {
    let f = curry(toArray, 3, __);

    let flipped = flip(f);

    flipped(__, null, "asdf", false).should.eql([ null, false, "asdf" ]);
  });

  it("should work with higher order curried functions", () => {
    const a = curry(a => curry((b, c) => a * 1 + b * 2 + c * 3));
    const flipped = flip(a);

    flipped(10, 20, 30).should.equal(20 * 1 + 10 * 2 + 30 * 3);
  });

  it("should return curried function with minimum arity 2, even if "
     + "original function has arity less than 2", () => {
    const c0 = curry(a => curry(b => [ a, b ]));
    const flipped = flip(c0);

    const array = [ null, true, "third arg", 4 ];
    flipped(...array).should.eql([ true, null ]);
  });
};
