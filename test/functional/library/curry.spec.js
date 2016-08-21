import comraq from "./../../../src";

import {
  multiply,
  getZero,
  add,
  toArray
} from "./../../test-data";

const {
  curry,
  placeholder: __,
  partial,
  isCurried,
  getArity,
  curriedApply
} = comraq.functional.library;

export default () => {
  describe("partial:", () => {
    it("should return a function", () => {
      partial(() => {}).should.be.a("function");
    });

    it("should throw error with non-function as first argument", () => {
      expect(partial).to.throw(/.*/);
      expect(partial.bind(null, "a string")).to.throw(/.*/);
      expect(partial.bind(null, "a string", () => {})).to.throw(/.*/);
    });

    it("can partially apply function with 1 argument", () => {
      const add = (a, b, c) => a + b + c;

      const add10 = partial(add, 10);
      add10(1, 2).should.equal(10 + 1 + 2);
    });

    it("can partially apply function with multiple arguments", () => {
      const add = (a, b, c) => a + b + c;

      const add10And11 = partial(add, 10, 11);
      add10And11(1).should.equal(10 + 11 + 1);

      const add10And11And12 = partial(add, 10, 11, 12);
      add10And11And12().should.equal(10 + 11 + 12);
      add10And11And12("more args", "should not affect result", 99).should.equal(
        10 + 11 + 12
      );
    });

    it("can repeatedly partially apply functions", () => {
      const add = (a, b, c) => a + b + c;

      const add10And11And12 = partial(partial(partial(add, 10), 11), 12);
      add10And11And12().should.equal(10 + 11 + 12);
    });
  });

  describe("curry:", () => {
    it("should return a function with not enough arguments passed", () => {
      curry(a => a).should.be.a("function");
      curry((a, b) => b)(123).should.be.a("function");
    });

    it("should return new curried function if "
       + "original function's arity is 0", () => {
      const orig = () => "a;lskdfjsad;kfjasd";
      const curried = curry(orig);

      curried.should.not.equal(orig);
      curried().should.equal(orig());
    });

    it("should evaluate results when enough arguments are passed", () => {
      expect(curry(() => {})()).to.equal(undefined);
      curry(getZero)().should.equal(0);
      curry(multiply)(13)(2).should.equal(26);
    });

    it("should throw error if curried functions with pending arguments "
       + "are called with no arguments", () => {
      const multC = curry(multiply);

      expect(multC.bind(null)).to.throw(/.*/);
    });

    it("currified functions can take variadic number of arguments", () => {
      const fiveArgs = function(a, b, c, d, e) {
        return Array.prototype.reduce.call(arguments, add);
      };

      curry(getZero)().should.equal(0);
      curry(multiply)(13, 2).should.equal(26);
      curry(fiveArgs)(1, 2)(3, 4, 5).should.equal(15);
    });

    it("can curry with placeholders", () => {
      const dummy = null;
      const func = curry(toArray, 5, dummy);

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
      sparse("a", "b", "c", "d", "e").should.eql(
        [ ...result, dummy, "g", "h" ]
      );
    });
  });

  describe("isCurried:", () => {
    it("should be true for functions returned by curry", () => {
      const curried = curry(a => a);
      isCurried(curried).should.be.true;
    });

    it("should also be true for curried functions of 0 arity", () => {
      const curried = curry(() => {});
      isCurried(curried).should.be.true;
    });
  });

  describe("getArity:", () => {
    it("should return the arity of a curried function, the number of "
       + "arguments to recieve before calling the function", () => {
      const c0 = curry(() => {});
      getArity(c0).should.equal(0);
    });

    it("should return -1 if the function is not curried", () => {
      const notCurried = () => {};

      getArity(notCurried).should.equal(-1);
      isCurried(notCurried).should.be.false;
    });

    it("should return decreasing arity values when "
       + "curried function is partially applied", () => {
      const c5 = curry((a, b, c, d, e) => {});

      getArity(c5).should.equal(5);
      getArity(c5(null)).should.equal(4);
      getArity(c5(null)(null)).should.equal(3);
      getArity(c5(null, null)(null, null)).should.equal(1);
      getArity(c5(null, null, null, null)).should.equal(1);
    });

    it("should also return decreasing arity values for placeholder"
       + "curried function when partially applied", () => {
      const c5 = curry((a, b, c, d, e) => {}, 5, __);

      getArity(c5).should.equal(5);
      getArity(c5(null)).should.equal(4);
      getArity(c5(null)(__)).should.equal(4);
      getArity(c5(__, __)(null, null)).should.equal(3);
      getArity(c5(null, __, __, null)(null)).should.equal(2);
    });
  });

  describe("curriedApply:", () => {
    it("should throw error if non-function is passed", () => {
      expect(curriedApply.bind(null, "not a function")).to.throw(/.*/);
    });

    it("should call a non-curried function as normal", () => {
      const array = [ null, {}, [], false, true, "1", "number" ];
      curriedApply(toArray, ...array).should.eql(array);
    });

    it("should call non-curried functions with all arguments, "
       + "regardless of arity", () => {
      const array = [ null, {}, [], false, true, "1", "number" ];
      const func = function(a, b) {
        return Array.prototype.slice.call(arguments);
      };

      curriedApply(func, ...array).should.eql(array);
    });

    it("should decrease the curried arity of curried function if "
       + "insufficient number of arguments are applied", () => {

      const array = [ null, {}, [] ];
      const c5 = curry(toArray, 5);
      const c2 = curriedApply(c5, ...array);

      c2.should.be.a("function");
      getArity(c2).should.equal(2);
    });

    it("should call curried function with only the number of arguments equal "
       + "to the curried arity even if excess arguments are supplied", () => {
      const array = [ null, {}, [], false, true, "1", "number" ];
      const c5 = curry(toArray, 5);

      curriedApply(c5, ...array).should.eql(array.slice(0, 5));

      const c0 = curry(toArray, 0);
      curriedApply(c0, ...array).should.eql([]);
    });

    it("should repeated apply arguments if curried functions returns another "
       + "function when excess arguments are supplied", () => {
      const curried = curry(a => curry(b => c => a + b + c));

      curriedApply(curried, 1, 2, 3).should.equal(6);
      curriedApply(curried, 1, 2, 3, 4).should.equal(6);
    });

    it("should repeated apply arguments if curried functions returns another "
       + "function until arguments runs out", () => {
      const e = curry(() => {});
      const d = curry(_ => e);
      const c = curry(_ => d);
      const b = curry(_ => c);
      const a = curry(_ => b);

      curriedApply(a, 1, 2, 3).should.equal(d);
      curriedApply(a, 1, 2, 3, 4).should.equal(e);
    });

    it("should repeated call curried functions with no arguments if "
       + "the curried arity is 0", () => {
      const e = arg => arg;
      const d = curry(() => e);
      const c = curry(() => d);
      const b = curry(() => c);
      const a = curry(() => b);

      const arg = "this is not passed to a, b, c, d because they have 0 arity";
      curriedApply(a, arg).should.eql(arg);
    });

    it("non-curried functions will catch all remaining excess/remaining "
       + "arguments even if they will return a function when called", () => {
      const c = (a, b, ...args) => [a, b, ...args];
      const b = curry(_ => c);
      const a = curry(_ => b);

      const array = [ null, {}, [], false, true, "1", "number" ];
      curriedApply(a, ...array).should.eql(array.slice(2));
    });
  });
};
