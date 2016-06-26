import comraq from "./../../src";
import contexts from "./transducers-context.spec.js";

import {
         inc10, triple,
         even, positive, getTrue, getFalse,
         array2, array1, numbersData,
         stubTransformer, isTransducer
       } from "./../test-data";

const {
  transduce,
  map, filter, remove, replace, distinct, dedupe, random, keep,
  initial, tail,
  take, takeWhile, takeNth, drop, dropWhile,
  partitionAll, partitionBy, interpose,
  isTransformer,
  concatMutable, concat
} = comraq.functional.transducers;

const { isNumber } = comraq.utils.checks;
const { reduce } = comraq.functional.iterables;
const { empty, identity } = comraq.functional.algebraic;
const { compose, placeholder: _ } = comraq.functional;
const { length } = comraq.functional.strings;
const { slice } = comraq.functional.arrays;

export default () => {
  describe("contexts:", contexts);

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

    it("should call mapping function with index and original iterable", () => {
      // keep passes index and original collection to the predicate function
      const index = (e, i, coll, c) =>
        (isNumber(i) && coll === array1 && isNumber(c))? e: null;

      map(index)(array1).should.eql(array1);
      reduce(map(index, concatMutable), empty(array1), array1)
        .should.be.eql(array1);
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

  describe("remove:", () => {
    it("should return a transducer if only mapping function is passed", () => {
      isTransducer(remove(() => {})).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(remove(() => {}, stubTransformer)).should.be.true;
    });

    it("should evaluate results when iterable is supplied", () => {
      const result1 = remove(even, numbersData);
      const result2 = remove(even)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(remove.bind(null, inc10, {})).to.throw(/.*/);
      expect(remove.bind(null, "a string", numbersData)).to.throw(/.*/);
      expect(remove.bind(null, triple, "a string", numbersData)).to.throw(/.*/);
    });

    it("can infinitely compose", () => {
      const A = remove(compose(positive, triple));
      const B = remove(compose(even, inc10, inc10, triple));
      const D = compose(
                  remove(compose(even, triple, inc10, inc10)), map(inc10)
                );
      const E = compose(
                  remove(positive),
                  remove(compose(even, inc10, triple, triple))
                );

      A(numbersData).should.eql(numbersData
        .filter(e =>
          e * 3 <= 0
        )
      );
      reduce(
        B(concatMutable),
        empty(numbersData),
        numbersData
      ).should.eql(numbersData
        .filter(e =>
          (e * 3 + 10 + 10) % 2 !== 0
        )
      );
      D(numbersData).should.eql(numbersData
        .map(e =>
          e + 10
        )
        .filter(e =>
          ((e + 10 + 10) * 3) % 2 !== 0
        )
      );
      E(numbersData).should.eql(numbersData
        .filter(e =>
          (e * 3 * 3 + 10) % 2 !== 0 && e < 0
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

  describe("distinct:", () => {
    it("should return an iterable with removing all second+ occurences of any "
      + "element, making it a set", () => {
      const arr = [ true, false, true, true, false, null, null, 1, 1, "true" ];
      const result = [ true, false, null, 1, "true" ];

      distinct(arr).should.eql(result);
      reduce(distinct(concatMutable), empty(arr), arr).should.eql(result);

      const arr2 = result;

      // Already a set (distinct), no entries removed
      distinct(arr2).should.eql(result);
      reduce(distinct(concatMutable), empty(arr), arr).should.eql(result);
    });

    it("should return a transducer if only count number is passed", () => {
      isTransducer(distinct).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(distinct(stubTransformer)).should.be.true;
    });
  });

  describe("dedupe:", () => {
    it("should return an iterable with removing all consecutive duplicate "
      + "occurences of any element", () => {
      const arr = [ true, false, true, true, false, null, null, 1, 1, "true" ];
      const result = [ true, false, true, false, null, 1, "true" ];

      dedupe(arr).should.eql(result);
      reduce(dedupe(concatMutable), empty(arr), arr).should.eql(result);

      const arr2 = result;

      // Already a set (distinct), no entries removed
      dedupe(arr2).should.eql(result);
      reduce(dedupe(concatMutable), empty(arr), arr).should.eql(result);
    });

    it("should return a transducer if only count number is passed", () => {
      isTransducer(dedupe).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(dedupe(stubTransformer)).should.be.true;
    });
  });

  describe("replace:", () => {
    it("should return an iterable whose collections have "
       + "all elements found as keys in the argument map replaced by "
       + "the values in the map", () => {
      const mapObj = new Map([
        [ true, "true replaced" ], 
        [ false, "false replaced" ],
        [ "asdfg", "asdfg replaced" ],
        [ 104, "104 replaced" ]
      ]);

      const result = [
        mapObj.get(true),
        mapObj.get(false),
        null,
        mapObj.get("asdfg"),
        mapObj.get(104)
      ];

      // Replace some elements
      replace(mapObj)(array1).should.eql(result);
      reduce(replace(mapObj)(concatMutable), empty(array1), array1)
        .should.eql(result);

      // Replace 0 elements -> should be same as original
      replace({})(array1).should.eql(array1);
      reduce(replace({})(concatMutable), empty(array1), array1)
        .should.eql(array1);

      const mapObj2 = new Map();
      mapObj2.set(null, "null replaced");

      const arr2 = [ null ];
      const result2 = [ mapObj2.get(null) ];

      // Replace all entries
      replace(mapObj2)(arr2).should.eql(result2);
      reduce(replace(mapObj2)(concatMutable), empty(arr2), arr2)
        .should.eql(result2);
    });

    it("should return a transducer if only count number is passed", () => {
      isTransducer(replace({})).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(replace({}, stubTransformer)).should.be.true;
    });
  });

  describe("interpose:", () => {
    it("should return an iterable with entry inserted between every element "
       + "in the original iterable", () => {
      const arr = [ true, false, "true", "false" ];
      const result = [ true, null, false, null, "true", null, "false" ];

      interpose(null)(arr).should.eql(result);
      reduce(interpose(null, concatMutable), empty(arr), arr)
        .should.eql(result);
    });

    it("should return a transducer if only count number is passed", () => {
      isTransducer(interpose(0)).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(interpose({})(stubTransformer)).should.be.true;
    });
  });

  describe("random:", () => {
    it("should return an iterable with elements remain "
       + "based on probability given", () => {
      random(0)(array1).should.be.a("array");
      reduce(random(1, concatMutable), empty(array1), array1)
        .should.be.a("array");
    });

    it("should return a transducer if only count number is passed", () => {
      isTransducer(random(0.1)).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(random(1)(stubTransformer)).should.be.true;
    });

    it("should throw error if probability is "
       + "less than 0 or greater than 1", () => {
      expect(random.bind(null, -2, [])).to.throw(/.*/);
      expect(random.bind(null, 100, concatMutable)).to.throw(/.*/);
    });
  });

  describe("keep:", () => {
    it("should return an iterable with elements remain when iterable "
       + "does not evaluate to null or undefined", () => {
      const arr = concat(undefined, array1);
      const result = array1.filter(
        e => (e === undefined || e === null)? null: true
      );

      keep(identity)(arr).should.eql(result);
      reduce(keep(identity, concatMutable), empty(arr), arr)
        .should.be.eql(result);

    });

    it("should call predicate with index and original iterable", () => {
      // keep passes index and original collection to the predicate function
      const index = (e, i, coll, c) =>
        (isNumber(i) && coll === array1 && isNumber(c))? true: null;

      keep(index)(array1).should.eql(array1);
      reduce(keep(index, concatMutable), empty(array1), array1)
        .should.be.eql(array1);
    });

    it("should return a transducer if only count number is passed", () => {
      isTransducer(keep(() => {})).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(keep(() => {})(stubTransformer)).should.be.true;
    });

    it("should throw error if predicate is not a function", () => {
      expect(keep.bind(null, null, array1)).to.throw(/.*/);
      expect(keep.bind(null, 100, concatMutable)).to.throw(/.*/);
    });
  });

  describe("take:", () => {
    it("should return a sub collection of iterable "
       + "from the head specified by count", () => {
      let result = slice(0, 2, array1);

      // Take some elements
      take(2)(array1).should.eql(result);
      reduce(take(2)(concatMutable), empty(array1), array1).should.eql(result);

      // Take 0 elements -> should be empty
      take(0)(array1).should.eql(empty(array1));
      reduce(take(0)(concatMutable), empty(array1), array1)
        .should.eql(empty(array1));

      // Take all elements -> should be same as original
      take(length(array1))(array1).should.eql(array1);
      reduce(take(length(array1))(concatMutable), empty(array1), array1)
        .should.eql(array1);

      // Take more than array length -> should be same as original
      take(length(array1) + 1)(array1).should.eql(array1);
      reduce(take(length(array1) + 1)(concatMutable), empty(array1), array1)
        .should.eql(array1);
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

      // TakeWhile true -> should be same as original
      takeWhile(getTrue)(array1).should.eql(array1);
      reduce(takeWhile(getTrue)(concatMutable), empty(array1), array1)
        .should.eql(array1);

      // TakeWhile false -> should be empty
      takeWhile(getFalse)(array1).should.eql(empty(array1));
      reduce(takeWhile(getFalse)(concatMutable), empty(array1), array1)
        .should.eql(empty(array1));
    });

    it("should return a transducer if only predicate is passed", () => {
      isTransducer(takeWhile(even)).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(takeWhile(even, stubTransformer)).should.be.true;
    });
  });

  describe("takeNth:", () => {
    it("should return a sub collection of iterable consisting of only every"
       + "-nth entry given a starting position", () => {
      let arr = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l" ];
      let result_5_n1 = [ "e", "j" ];
      let result_5_0 = [ "a", "f", "k" ];
      let result_3_n2 = [ "b", "e", "h", "k" ];
      let result_3_3 = [ "d", "g", "j" ];

      const tN = takeNth(_, _, arr);
      const tNT = takeNth(_, _, concatMutable);

      // Take every 5th starting with 0th
      tN(5, arr).should.eql(result_5_0);
      reduce(tN(5)(concatMutable), empty(arr), arr).should.eql(result_5_0);

      // Take every 5th starting with -1st
      tN(5, -1).should.eql(result_5_n1);
      reduce(tNT(5)(-1), empty(arr), arr)
        .should.eql(result_5_n1);

      // Take every 3rd starting with -2nd
      tN(3, -2).should.eql(result_3_n2);
      reduce(tNT(3)(-2), empty(arr), arr)
        .should.eql(result_3_n2);

      // Take every 3rd starting with -2nd
      tN(3, 3).should.eql(result_3_3);
      reduce(tNT(3)(3), empty(arr), arr)
        .should.eql(result_3_3);

      // Take every 100th elements -> should be empty
      tN(100, -2).should.eql(empty(arr));
      reduce(tNT(100, -2), empty(arr), arr)
        .should.eql(empty(arr));

      // Take every 1th elements -> should be same as original
      tN(1)(arr).should.eql(arr);
      reduce(tN(1)(concatMutable), empty(arr), arr)
        .should.eql(arr);
    });

    it("should throw an error if 'n' is not a positive number", () => {
      expect(takeNth.bind(null, 0, array1)).to.throw(/.*/);
      expect(takeNth.bind(null, -1, concatMutable)).to.throw(/.*/);
    });

    it("should return a transducer if only count number is passed", () => {
      isTransducer(take(0)).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(take(1, stubTransformer)).should.be.true;
    });
  });

  describe("drop:", () => {
    it("should return a sub collection of iterable "
       + "without first number of entries specified by count", () => {
      let result = slice(2, length(array1), array1);

      // Drop some elements
      drop(2)(array1).should.eql(result);
      reduce(drop(2)(concatMutable), empty(array1), array1).should.eql(result);

      // Drop 0 elements -> should be same as original
      drop(0)(array1).should.eql(array1);
      reduce(drop(0)(concatMutable), empty(array1), array1).should.eql(array1);

      // Drop all elements -> should be empty
      drop(length(array1))(array1).should.eql(empty(array1));
      reduce(drop(length(array1))(concatMutable), empty(array1), array1)
        .should.eql(empty(array1));

      // Drop more than array length elements -> should be empty
      drop(length(array1) + 1)(array1).should.eql(empty(array1));
      reduce(drop(length(array1) + 1)(concatMutable), empty(array1), array1)
        .should.eql(empty(array1));
    });

    it("should return a transducer if only count number is passed", () => {
      isTransducer(drop(0)).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(drop(1, stubTransformer)).should.be.true;
    });
  });

  describe("dropWhile:", () => {
    it("should return a sub collection of iterable from the head until "
       + "function passed as argument returns false", () => {
      const coll = array1;
      const notNumber = x => !isNumber(x);

      const res1 = transduce(
        dropWhile(notNumber),
        concatMutable,
        empty(coll),
        coll
      );
      const res2 = reduce(
        dropWhile(notNumber, concatMutable),
        empty(coll),
        coll
      );
      const res3 = dropWhile(notNumber, coll);

      res1.should.eql(res2);
      res2.should.eql(res3);
      res3.should.eql(res1);

      // DropWhile false -> should be same as original
      dropWhile(getFalse)(array1).should.eql(array1);
      reduce(dropWhile(getFalse)(concatMutable), empty(array1), array1)
        .should.eql(array1);

      // DropWhile true -> should be empty
      dropWhile(getTrue)(array1).should.eql(empty(array1));
      reduce(dropWhile(getTrue)(concatMutable), empty(array1), array1)
        .should.eql(empty(array1));
    });

    it("should return a transducer if only predicate is passed", () => {
      isTransducer(dropWhile(even)).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(dropWhile(even, stubTransformer)).should.be.true;
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
