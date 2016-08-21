import comraq from "./../../../src";

import { toArray } from "./../../test-data";

const {
  nAry,
  curry,
  isCurried,
  placeholder: __
} = comraq.functional.library;

export default () => {
  describe("nAry:", () => {
    it("should return a function", () => {
      nAry(5, () => {}).should.be.a("function");
    });

    it("should throw an error is first argument "
       + "is not a natural number", () => {
      expect(nAry.bind(null, -1, () => {})).to.throw(/.*/);
    });

    it("should throw an error is second argument is not a function", () => {
      expect(nAry.bind(null, 0, "asdf")).to.throw(/.*/);
    });

    it("should preserve the 'curried' status of the original function", () => {
      const ary0 = nAry(0, toArray);
      const ary4 = nAry(4, toArray);
      const ary0C = nAry(0, curry(toArray));
      const ary4C = nAry(4, curry(toArray));

      isCurried(ary0).should.be.false;
      isCurried(ary4).should.be.false;
      isCurried(ary0C).should.be.true;
      isCurried(ary4C).should.be.true;
    });

    it("should call function with the arity given", () => {
      let arityCheck = (...args) => args.length;

      nAry(5, arityCheck)(null, null, null, null, null, null).should.equal(5);
      nAry(0, arityCheck)(null, null).should.equal(0);
    });

    it("should call function with fewer than fixed arity if function is "
       + "originally not curried", () => {
      let arityCheck = (...args) => args.length;

      nAry(5, arityCheck)(null, null).should.equal(2);
    });

    it("should return a curried function if the number of arguments "
       + "given to the fixed arity curried function is "
       + "less than the specified arity", () => {
      let arityCheck = curry((...args) => args.length);

      let ac5 = nAry(5, arityCheck);

      let temp = ac5(null, null);
      temp.should.be.a("function");

      temp = temp(null);
      temp.should.be.a("function");

      temp(null, null).should.equal(5);
    });

    it("fixed arity curried functions should preserve curried "
       + "placeholders", () => {
      let arityCheck = curry((...args) => args, 3, __);

      let ac5 = nAry(5, arityCheck);

      let temp = ac5(__, __);
      temp.should.be.a("function");

      temp = temp(null)(null, null);
      temp.should.be.a("function");

      temp(null, null).should.eql([ null, null, null, null, null ]);
    });
  });
};
