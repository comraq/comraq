import comraq from "./../../src";

import {
  multiply,
  getZero,
  add, inc5,
  arity1Add,
  toArray
} from "../test-data";

const { curry, currify, autoCurry } = comraq.functional;

export default () => {
  describe("curry:", () => {
    it("should return a function", () => {
      curry(() => {}).should.be.a("function");
    });

    it("should throw error with non-function as first argument", () => {
      expect(curry).to.throw(/.*/);
      expect(curry.bind(null, "a string")).to.throw(/.*/);
      expect(curry.bind(null, "a string", () => {})).to.throw(/.*/);
    });

    it("can curry function with 1 argument", () => {
      const add = (a, b, c) => a + b + c;

      const add10 = curry(add, 10);
      add10(1, 2).should.equal(10 + 1 + 2);
    });

    it("can curry function with multiple arguments", () => {
      const add = (a, b, c) => a + b + c;

      const add10And11 = curry(add, 10, 11);
      add10And11(1).should.equal(10 + 11 + 1);

      const add10And11And12 = curry(add, 10, 11, 12);
      add10And11And12().should.equal(10 + 11 + 12);
      add10And11And12("more args", "should not affect result", 99).should.equal(
        10 + 11 + 12
      );
    });

    it("can repeatedly curry functions", () => {
      const add = (a, b, c) => a + b + c;

      const add10And11And12 = curry(curry(curry(add, 10), 11), 12);
      add10And11And12().should.equal(10 + 11 + 12);
    });
  });

  describe("currify:", () => {
    it("should return a function with not enough arguments passed", () => {
      currify(a => a).should.be.a("function");
      currify((a, b) => b)(123).should.be.a("function");
    });

    it("should evaluate results when enough arguments are passed", () => {
      expect(currify(() => {})).to.equal(undefined);
      currify(getZero).should.equal(0);
      currify(multiply)(13)(2).should.equal(26);
    });

    it("currified functions can take variadic number of arguments", () => {
      const fiveArgs = function(a, b, c, d, e) {
        return Array.prototype.reduce.call(arguments, add);
      };

      currify(getZero).should.equal(0);
      currify(multiply)(13, 2).should.equal(26);
      currify(fiveArgs)(1, 2)(3, 4, 5).should.equal(15);
    });

    it("can curry from right to left", () => {
      const appendString = currify(
        (target, toAppend) => target + toAppend,
        2,
        true
      );
      const map = currify((array, func) => array.map(func), 2, true);

      const appendHash = appendString("#");
      const addFive = map(inc5);

      appendHash.should.be.a("function");
      addFive.should.be.a("function");

      const strResults = "comraq#";
      const arrResults = [ 6, 7, 8 ];

      appendHash("comraq").should.equal(strResults);
      addFive([ 1, 2, 3 ]).should.eql(arrResults);

      appendString("#", "comraq").should.equal(strResults);
      map(inc5, [ 1, 2, 3 ]).should.eql(arrResults);
    });

    it("can curry with placeholders", () => {
      const dummy = null;
      const func = currify(toArray, 5, false, dummy);

      const before = func("a", "b", dummy, dummy);
      const after  = func(dummy, dummy, "c");
      const mid    = func(dummy, dummy, "c", dummy);
      const last   = func(dummy, dummy, dummy, dummy, "e");
      const all    = func(dummy, dummy, dummy, dummy, dummy);

      before.should.be.a("function");
      after.should.be.a("function");
      mid.should.be.a("function");
      last.should.be.a("function");
      all.should.be.a("function");

      const result = [ "a", "b", "c", "d", "e" ];
      before("c", "d", "e").should.eql(result);
      after("a")("b", "d")("e").should.eql(result);
      mid("a", "b", "d", "e").should.eql(result);
      last("a")("b")("c")("d").should.eql(result);
      all("a")("b")("c", "d", "e").should.eql(result);

      let again = all(dummy, dummy, "c");
      again.should.be.a("function");

      again = again(dummy, dummy, "d");
      again.should.be.a("function");

      again = again("a", dummy, "e");
      again.should.be.a("function");

      again("b").should.eql(result);

      again("b", "f").should.eql([ ...result, "f" ]);

      let sparse = all(dummy, dummy, dummy, dummy, dummy, dummy, "g", "h");
      sparse("a", "b", "c", "d").should.be.a("function");
      sparse("a", "b", "c", dummy, "e").should.be.a("function");
      sparse("a", "b", "c", "d", "e").should.eql([ ...result, "g", "h" ]);
    });
  });

  describe("autoCurry:", () => {
    it("should return a function with not enough arguments passed", () => {
      autoCurry(a => a).should.be.a("function");
      autoCurry((a, b) => b)(123).should.be.a("function");
    });

    it("should evaluate results when enough arguments are passed", () => {
      expect(autoCurry(() => {})).to.equal(undefined);
      autoCurry(getZero).should.equal(0);
      autoCurry(multiply)(13)(2).should.equal(26);
    });

    it("autoCurried functions can take variadic number of arguments", () => {
      const fiveArgs = function(a, b, c, d, e) {
        return Array.prototype.reduce.call(arguments, add);
      };

      autoCurry(getZero).should.equal(0);
      autoCurry(multiply)(13, 2).should.equal(26);
      autoCurry(fiveArgs)(1, 2)(3, 4, 5).should.equal(15);
    });

    it("should work with functions returning arity 1 functions", () => {
      let addFiveVals = autoCurry(arity1Add);

      addFiveVals.should.be.a("function");
      addFiveVals(1)(2).should.be.a("function");
      addFiveVals(1, 2).should.be.a("function");
      addFiveVals(1, 2, 3, 4, 5).should.equal(15);
      addFiveVals(1)(2)(3)(4)(5).should.equal(15);
      addFiveVals(1, 2)(3, 4)(5).should.equal(15);
    });
  });
};
