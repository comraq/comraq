import comraq from "./../../src";

import { multiply, getZero, add } from "../test-data";

const { curry, currify } = comraq.functional;

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
  });
};
