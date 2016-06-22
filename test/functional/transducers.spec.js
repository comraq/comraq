import comraq from "./../../src";

import {
         inc5, inc10,
         triple,
         even, positive,
         array2, array1, numbersData,
         stubTransformer, isTransducer
       } from "./../test-data";

const {
  transduce, transduce1, into,
  map, filter,
  initial, tail,
  take, takeWhile,
  partitionAll, partitionBy,
  isTransformer, Transformer,
  concatMutable
} = comraq.functional.transducers;

const { isNumber } = comraq.utils.checks;
const { reduce } = comraq.functional.iterables;
const { empty, identity } = comraq.functional.algebraic;
const { compose } = comraq.functional;
const { length } = comraq.functional.strings;
const { slice } = comraq.functional.arrays;

export default () => {
  describe("transduce:", () => {
    it("should return a function without providing a collection", () => {
      transduce(map(triple), concatMutable).should.be.a("function");
    });

    it("should get results if a collection is provided", () => {
      let coll = array2;

      let xform = compose(
        map(inc5),
        filter(even),
        take(5),
        map(triple)
      );

      transduce(xform, concatMutable, empty(coll), coll).should.eql(
        coll
          .map(inc5)
          .filter(even)
          .slice(0, 5)
          .map(triple)
        );
    });

    it("should work with all other transducers", () => {
      expect.fail(null, null, "test not yet implemented");
    });
  });

  describe("transduce1:", () => {
    const arrayConcatMutable = Transformer(
      (value, array) => {
        array.push(value);
        return value;
      },
      identity,
      () => [],
      (acc, next) => {
        acc.push(next);
        return acc;
      }
    );

    it("should return a function without providing a collection", () => {
      transduce1(map(triple), arrayConcatMutable).should.be.a("function");
    });

    it("should get results if a collection is provided", () => {
      let coll = array2;

      let xform = compose(
        map(inc5),
        filter(even),
        take(4)
      );

      transduce1(xform, arrayConcatMutable, coll).should.eql(
        coll
          .map(inc5)
          .filter(even)
          .slice(0, 4)
        );
    });

    it("should work with all other transducers", () => {
      expect.fail(null, null, "test not yet implemented");
    });
  });

  describe("into:", () => {
    it("should return a function without providing a collection", () => {
      into([], map(triple)).should.be.a("function");
    });

    it("should get results if a collection is provided", () => {
      let xform = compose(
        map(inc5),
        filter(even),
        take(5),
        map(triple)
      );

      into([], xform, numbersData).should.eql(
        numbersData
          .map(inc5)
          .filter(even)
          .slice(0, 5)
          .map(triple)
        );
    });

    it("should work with all other transducers", () => {
      expect.fail(null, null, "test not yet implemented");
    });
  });

  describe("map:", () => {
    it("should return a transducer if only mapping function is passed", () => {
      isTransducer(map(() => {})).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(map(() => {}, stubTransformer)).should.be.true;
    });

    it("should evaluate results when iterable is supplied", () => {
      const result1 = map(inc10, numbersData);
      const result2 = map(inc10)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(map.bind(null, undefined, undefined)).to.throw(/.*/);
      expect(map.bind(null, "a string", numbersData)).to.throw(/.*/);
      expect(map.bind(null, triple, "a string", numbersData)).to.throw(/.*/);
    });

    it("can infinitely compose", () => {
      const B = map(compose(inc10, inc10, triple));
      const C = compose(map(inc10), map(compose(triple, inc10, inc10)));
      const E = map(compose(triple, inc10, inc10))(numbersData);

      reduce(
        B(concatMutable),
        empty(numbersData),
        numbersData
      ).should.eql(numbersData
        .map(e =>
          e * 3 + 10 + 10
        )
      );
      C(numbersData).should.eql(numbersData
        .map(e =>
          (e + 10 + 10) * 3 + 10
        )
      );

      E.should.eql(numbersData
        .map(e =>
          (e + 10 + 10) * 3
        )
      );
    });
  });

  describe("filter:", () => {
    it("should return a transducer if only mapping function is passed", () => {
      isTransducer(filter(() => {})).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(filter(() => {}, stubTransformer)).should.be.true;
    });

    it("should evaluate results when iterable is supplied", () => {
      const result1 = filter(even, numbersData);
      const result2 = filter(even)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(filter.bind(null, inc10, {})).to.throw(/.*/);
      expect(filter.bind(null, "a string", numbersData)).to.throw(/.*/);
      expect(filter.bind(null, triple, "a string", numbersData)).to.throw(/.*/);
    });

    it("can infinitely compose", () => {
      const A = filter(compose(positive, triple));
      const B = filter(compose(even, inc10, inc10, triple));
      const D = compose(
                  filter(compose(even, triple, inc10, inc10)), map(inc10)
                );
      const E = compose(
                  filter(positive),
                  filter(compose(even, inc10, triple, triple))
                );

      A(numbersData).should.eql(numbersData
        .filter(e =>
          e * 3 > 0
        )
      );
      reduce(
        B(concatMutable),
        empty(numbersData),
        numbersData
      ).should.eql(numbersData
        .filter(e =>
          (e * 3 + 10 + 10) % 2 === 0
        )
      );
      D(numbersData).should.eql(numbersData
        .map(e =>
          e + 10
        )
        .filter(e =>
          ((e + 10 + 10) * 3) % 2 === 0
        )
      );
      E(numbersData).should.eql(numbersData
        .filter(e =>
          (e * 3 * 3 + 10) % 2 === 0 && e > 0
        )
      );
    });
  });

  describe("partitionAll:", () => {
    it("should partition a collection into "
       + "an array of sub-collections (partitions)", () => {
      const coll = array2;
      const size = 3;

      let result = (() => {
        let count = 0;
        let part = empty(coll);

        return coll
          .reduce((acc, next, i, coll) => {
            if (count++ < size)
              part = concatMutable(next, part);

            else {
              acc = concatMutable(part, acc);
              count = 1;
              part = concatMutable(next, empty(coll));
            }

            if (i === length(coll) - 1 && length(part) > 0)
              acc = concatMutable(part, acc);

            return acc;
          }, empty(coll), coll);
      })();

      partitionAll(size, coll).should.eql(result);
      reduce(
        partitionAll(size, concatMutable),
        empty(coll),
        coll
      ).should.eql(result);
    });

    it("should return a transducer if only count number is passed", () => {
      isTransducer(partitionAll(0)).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(partitionAll(1, stubTransformer)).should.be.true;
    });
  });

  describe("partitionBy:", () => {
    it("should partition a collection into "
       + "an array of sub-collections (partitions)", () => {
      const coll = numbersData;
      const pred = even;

      let result = (() => {
        let value = undefined;
        let part = empty(coll);

        return coll
          .reduce((acc, next, i, coll) => {
            let nextVal = pred(next);
            if (value === undefined || nextVal === value)
              part = concatMutable(next, part);

            else {
              acc = concatMutable(part, acc);
              part = concatMutable(next, empty(coll));
            }

            value = nextVal;
            if (i === length(coll) - 1 && length(part) > 0)
              acc = concatMutable(part, acc);

            return acc;
          }, empty(coll), coll);
      })();

      partitionBy(pred, coll).should.eql(result);
      reduce(
        partitionBy(pred, concatMutable),
        empty(coll),
        coll
      ).should.eql(result);
    });

    it("should return a transducer if only count number is passed", () => {
      isTransducer(partitionBy(even)).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(partitionBy(even, stubTransformer)).should.be.true;
    });
  });
  describe("take:", () => {
    it("should return a sub collection of iterable "
       + "from the head specified by count", () => {
      let result = slice(0, 2, array1);

      take(2)(array1).should.eql(result);
      reduce(take(2)(concatMutable), empty(array1), array1).should.eql(result);
    });

    it("should return a transducer if only count number is passed", () => {
      isTransducer(take(0)).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(take(1, stubTransformer)).should.be.true;
    });
  });

  describe("takeWhile:", () => {
    it("should return a sub collection of iterable from the head until "
       + "function passed as argument returns false", () => {
      const coll = array1;
      const notNumber = x => !isNumber(x);

      const res1 = transduce(
        takeWhile(notNumber),
        concatMutable,
        empty(coll),
        coll
      );
      const res2 = reduce(
        takeWhile(notNumber, concatMutable),
        empty(coll),
        coll
      );
      const res3 = takeWhile(notNumber, coll);

      res1.should.eql(res2);
      res2.should.eql(res3);
      res3.should.eql(res1);
    });

    it("should return a transducer if only predicate is passed", () => {
      isTransducer(takeWhile(even)).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(takeWhile(even, stubTransformer)).should.be.true;
    });
  });

  describe("tail:", () => {
    it("should return all iterable elements except the first", () => {
      let result = slice(1, array1.length)(array1);

      tail(array1).should.eql(result);
      reduce(tail(concatMutable), empty(array1), array1).should.eql(result);
    });

    it("should return a transducer if only predicate is passed", () => {
      isTransducer(tail).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(tail(stubTransformer)).should.be.true;
    });
  });

  describe("init:", () => {
    it("should return all iterable elements except the last", () => {
      let result = slice(0, -1)(array1);

      initial(array1).should.eql(result);
      reduce(initial(concatMutable), empty(array1), array1).should.eql(result);
    });

    it("should return a transducer if only predicate is passed", () => {
      isTransducer(initial).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(initial(stubTransformer)).should.be.true;
    });
  });
};
