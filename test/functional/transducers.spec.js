import comraq from "./../../src";

import {
         inc5, inc10,
         triple,
         even, positive,
         array2, array1, numbersData,
         stubTransformer, isTransducer
       } from "./../test-data";

const {
  transduce,
  map,
  filter,
  take, takeWhile,
  partitionAll,
  isTransformer,
  concatMutable: concatMutableT
} = comraq.functional.transducers;

const { isNumber } = comraq.utils.checks;
const { reduce } = comraq.functional.iterables;
const { concatMutable, empty } = comraq.functional.algebraic;
const { compose } = comraq.functional;
const { length } = comraq.functional.strings;
const { slice } = comraq.functional.arrays;

export default () => {
  describe("transduce:", () => {
    it("should return a function without providing a collection", () => {
      transduce(map(triple), concatMutableT).should.be.a("function");
    });

    it("should get results if a collection is provided", () => {
      let coll = array2;

      let xform = compose(
        map(inc5),
        filter(even),
        take(5),
        map(triple)
      );

      transduce(xform, concatMutableT, empty(coll), coll).should.deep.equal(
        coll
          .map(inc5)
          .filter(even)
          .slice(0, 5)
          .map(triple)
        );
    });
  });

  describe("into:", () => {
    it("should return a function without providing a collection", () => {
      expect.fail(null, null, "test not yet implemented");
    });

    it("should get results if a collection is provided", () => {
      expect.fail(comraq, null, "test not yet implemented");
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

      B(numbersData).should.deep.equal(numbersData
        .map(e =>
          e * 3 + 10 + 10
        )
      );
      C(numbersData).should.deep.equal(numbersData
        .map(e =>
          (e + 10 + 10) * 3 + 10
        )
      );

      E.should.deep.equal(numbersData
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

      A(numbersData).should.deep.equal(numbersData
        .filter(e =>
          e * 3 > 0
        )
      );
      B(numbersData).should.deep.equal(numbersData
        .filter(e =>
          (e * 3 + 10 + 10) % 2 === 0
        )
      );
      D(numbersData).should.deep.equal(numbersData
        .map(e =>
          e + 10
        )
        .filter(e =>
          ((e + 10 + 10) * 3) % 2 === 0
        )
      );
      E(numbersData).should.deep.equal(numbersData
        .filter(e =>
          (e * 3 * 3 + 10) % 2 === 0 && e > 0
        )
      );
    });
  });

  describe("partitionAll:", () => {
    it("should partition a collection into "
       + "an array of sub-collections (partitions)", () => {
      let coll = array2;
      let size = 3;
      let count = 0;
      let part = empty(coll);
      
      partitionAll(size, coll).should.eql(
        array2
          .reduce((acc, next, i, coll) => {
            if (count++ < size)
              part = concatMutable(part, next);

            else {
              acc = concatMutable(acc, part);
              count = 1;
              part = concatMutable(empty(coll), next);
            }

            if (i === length(coll) - 1 && length(part) > 0)
              acc = concatMutable(acc, part);

            return acc;
          }, empty(coll))
      );
    });

    it("should return a transducer if only count number is passed", () => {
      isTransducer(partitionAll(0)).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(partitionAll(1, stubTransformer)).should.be.true;
    });
  });

  describe("take:", () => {
    it("should return a sub collection of iterable "
       + "from the head specified by count", () => {
      take(2)(array1).should.deep.equal(slice(0, 2)(array1));
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
        concatMutableT,
        empty(coll),
        coll
      );
      const res2 = reduce(
        takeWhile(notNumber, concatMutableT),
        empty(coll),
        coll
      );
      const res3 = takeWhile(notNumber, coll);

      res1.should.eql(res2);
      res2.should.eql(res3);
      res3.should.eql(res1);
    });
  });
};
