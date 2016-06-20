import comraq from "./../../src";
import iterReduce from "./../../src/functional/iterables/iterable-reduce";

import {
         numbersData,
         inc10,
         triple,
         even,
         positive,
         add,
         subtract,
         array1
       } from "./../test-data";

const {
  getIterator, reverse,
  reduce: reduceL, reduceRight: reduceR,
  reduce1: reduceL1, reduceRight1: reduceR1,
  head, tail, init, last
} = comraq.functional.iterables;

const { compose } = comraq.functional;
const { slice } = comraq.functional.arrays;
const { map, filter } = comraq.functional.transducers;

export default () => {
  describe("getIterator:", () => {
    it("should return an iterator", () => {
      getIterator([]).next.should.be.a("Function");
    });
  });

  describe("reverse:", () => {
    it("should return an iteratable which "
       + "will iterate in the reverse order", () =>  {
      let testArray = array1.slice();
      reverse(array1).should.deep.equal(testArray.reverse());
    });
  });

  describe("iterable-reduce:", () => {
    it("should return a function when iterable is not provided", () => {
      iterReduce(() => {}, 0).should.be.a("function");
    });

    it("should reduce an iterable", () => {
      iterReduce(add, -5, [ 1, 2, 3, 4, 5 ]).should.equal(10);
    });
  });

  describe("reduceLeft:", () => {
    it("should return a function when iterable not supplied", () => {
      const result = reduceL(add);
      result.should.be.a("function");
    });

    it("should evaluate results when iterable is supplied", () => {
      const result1 = reduceL(subtract, 0, numbersData);
      const result2 = reduceL(subtract, 0)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(reduceL.bind(null, add, null, null)).to.throw(/.*/);
      expect(reduceL.bind(null, "a string", numbersData, true)).to.throw(/.*/);
    });

    it("should reduce iterable results to single value", () => {
      const A = reduceL(add, -3);
      const B = compose(reduceL(subtract, 100), map(triple));
      const C = compose(
        reduceL(add, 0),
        map(compose(inc10, triple)),
        filter(even)
      );

      A(numbersData).should.equal(numbersData
        .reduce((a, b) =>
          a + b
        , -3)
      );
      B(numbersData).should.equal(numbersData
        .map(e =>
          e * 3
        )
        .reduce((a, b) =>
          a - b
        , 100)
      );
      C(numbersData).should.equal(numbersData
        .filter(e =>
          e % 2 === 0
        )
        .map(e =>
          e * 3 + 10
        )
        .reduce((a, b) =>
          a + b
        , 0)
      );
    });
  });

  describe("reduceLeft1:", () => {
    it("should return a function when iterable not supplied", () => {
      const result = reduceL1(add);
      result.should.be.a("function");
    });

    it("should evaluate results when iterable is supplied", () => {
      const result1 = reduceL1(subtract, numbersData);
      const result2 = reduceL1(subtract)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(reduceL1.bind(null, add, null)).to.throw(/.*/);
      expect(reduceL1.bind(null, "a string", numbersData)).to.throw(/.*/);
    });

    it("should reduce iterable results to single value", () => {
      const A = reduceL1(add);
      const B = compose(reduceL1(subtract), map(triple));
      const C = compose(
        reduceL1(add),
        map(compose(inc10, triple)),
        filter(even)
      );

      A(numbersData).should.equal(numbersData
        .reduce((a, b) =>
          a + b
        )
      );
      B(numbersData).should.equal(numbersData
        .map(e =>
          e * 3
        )
        .reduce((a, b) =>
          a - b
        )
      );
      C(numbersData).should.equal(numbersData
        .filter(e =>
          e % 2 === 0
        )
        .map(e =>
          e * 3 + 10
        )
        .reduce((a, b) =>
          a + b
        )
      );
    });
  });

  describe("reduceRight:", () => {
    it("should return a function when iterable not supplied", () => {
      const result = reduceR(add);

      result.should.be.a("function");
    });

    it("should evaluate results when iterable is supplied", () => {
      const result1 = reduceR(subtract, 100, numbersData);
      const result2 = reduceR(subtract, 100)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(reduceR.bind(null, add, null, true)).to.throw(/.*/);
      expect(reduceR.bind(null, "a string", numbersData, null)).to.throw(/.*/);
    });

    it("should reduce iterable results to single value", () => {
      const A = reduceR(add, 29);
      const B = compose(reduceR(subtract, 7), map(triple));
      const C = compose(
        reduceR(add, 3),
        map(compose(inc10, triple)),
        filter(even)
      );
      const D = reduceR(add, -3);

      A(numbersData).should.equal(numbersData
        .reduceRight((a, b) =>
          a + b
        , 29)
      );
      B(numbersData).should.equal(numbersData
        .map(e =>
          e * 3
        )
        .reduceRight((a, b) =>
          a - b
        , 7)
      );
      C(numbersData).should.equal(numbersData
        .filter(e =>
          e % 2 === 0
        )
        .map(e =>
          e * 3 + 10
        )
        .reduceRight((a, b) =>
          a + b
        , 3)
      );
      D(numbersData).should.equal(reduceL(add, -3, numbersData));
    });
  });

  describe("reduceRight1:", () => {
    it("should return a function when iterable not supplied", () => {
      const result = reduceR1(add);

      result.should.be.a("function");
    });

    it("should evaluate results when iterable is supplied", () => {
      const result1 = reduceR1(subtract, numbersData);
      const result2 = reduceR1(subtract)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(reduceR1.bind(null, add, null)).to.throw(/.*/);
      expect(reduceR1.bind(null, "a string", numbersData)).to.throw(/.*/);
    });

    it("should reduce iterable results to single value", () => {
      const A = reduceR1(add);
      const B = compose(reduceR1(subtract), map(triple));
      const C = compose(
        reduceR1(add),
        map(compose(inc10, triple)),
        filter(even)
      );
      const D = reduceR1(add);
      const E = reduceR1(subtract);

      A(numbersData).should.equal(numbersData
        .reduceRight((a, b) =>
          a + b
        )
      );
      B(numbersData).should.equal(numbersData
        .map(e =>
          e * 3
        )
        .reduceRight((a, b) =>
          a - b
        )
      );
      C(numbersData).should.equal(numbersData
        .filter(e =>
          e % 2 === 0
        )
        .map(e =>
          e * 3 + 10
        )
        .reduceRight((a, b) =>
          a + b
        )
      );
      D(numbersData).should.equal(reduceL1(add, numbersData));
      E(numbersData).should.not.equal(reduceL1(subtract, numbersData));
    });
  });

  describe("head:", () => {
    it("should return the first element of the iterable", () => {
      head(array1).should.be.true;
    });
  });

  describe("tail:", () => {
    it("should return all iterable elements except the first", () => {
      tail(array1).should.deep.equal(slice(1, array1.length)(array1));
    });
  });

  describe("init:", () => {
    it("should return all iterable elements except the last", () => {
      init(array1).should.deep.equal(slice(0, -1)(array1));
    });
  });

  describe("last:", () => {
    it("should return the last element of the iterable", () => {
      last(array1).should.equal(104);
    });
  });
};
