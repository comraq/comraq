import comraq from "./../../../src";

import {
  inc10, triple,
  even, positive, getTrue, getFalse,
  array2, array1, numbersData,
  stubTransformer, isTransducer
} from "./../../test-data";

const {
  transduce, identity: idT,
  map, filter, remove, replace, distinct, dedupe, random, keep,
  initial, tail,
  take, takeWhile, takeNth, drop, dropWhile,
  partitionAll, partitionBy, interpose,
  isTransformer,
  cat, flatmap
} = comraq.functional.transducers;

const { isNumber } = comraq.utils.checks;
const { reduce, toArray } = comraq.functional.iterables;
const { compose, placeholder: _, empty, identity } = comraq.functional.library;
const { length } = comraq.functional.strings;
const { slice, push, pushMutable } = comraq.functional.arrays;

export default () => {
  describe("identity:", () => {
    it("should be a transducer", () => {
      isTransducer(idT).should.be.true;
    });

    it("should return a transformer if a transformer is supplied", () => {
      isTransformer(idT(stubTransformer)).should.be.true;
    });

    it("should throw error if non-transformer is supplied", () => {
      expect(idT.bind(null, () => {})).to.throw(/.*/);
    });

    it("should transduce/reduce to original target", () => {
      reduce(
        idT(pushMutable),
        empty(numbersData),
        numbersData
      ).should.eql(numbersData);
    });
  });

  describe("cat:", () => {
    it("should be a transducer", () => {
      isTransducer(cat).should.be.true;
    });

    it("should return a transformer if a transformer is supplied", () => {
      isTransformer(cat(stubTransformer)).should.be.true;
    });

    it("should throw error if argument is not transformer", () => {
      expect(cat.bind(null, "asdf", [])).to.throw(/.*/);
      expect(cat.bind(null, [], {})).to.throw(/.*/);
    });

    it("should flatten nested arrays by 1 level", () => {
      let testArray = [ [5], [true], [ false, null, ["asdf", {}] ] ];

      let result = reduce(cat(pushMutable), [], testArray);
      result.should.have.lengthOf(5);
      result.should.eql([ 5, true, false, null, ["asdf", {}] ]);
    });

    it("should compose with other transformers", () => {
      let testArray = [
        [ 5 ],
        [ true, 1, "hi" ],
        [ false, null, [ "asdf", {} ] ]
      ];

      let xform = compose(take(2), cat);

      let result = reduce(xform(pushMutable), [], testArray);

      result.should.have.lengthOf(4);
      result.should.eql([ 5, true, 1, "hi"]);
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
      const [ ...result1 ] = map(inc10, numbersData);
      const [ ...result2 ] = map(inc10)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(map.bind(null, undefined, undefined)).to.throw(/.*/);
      expect(map.bind(null, "a string", numbersData)).to.throw(/.*/);
    });

    it("can infinitely compose", () => {
      const B = map(compose(inc10, inc10, triple));
      const C = compose(
        toArray,
        map(inc10),
        map(compose(triple, inc10, inc10))
      );
      const [ ...E ] = map(compose(triple, inc10, inc10))(numbersData);

      reduce(
        B(pushMutable),
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

      toArray(map(index)(array1)).should.eql(array1);
      reduce(map(index, pushMutable), empty(array1), array1)
        .should.be.eql(array1);
    });
  });

  describe("flatmap:", () => {
    it("should return a transducer if only mapping function is passed", () => {
      isTransducer(flatmap(() => {})).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(flatmap(() => {}, stubTransformer)).should.be.true;
    });

    it("should flatten collection if mapping function "
       + "yields a collection at each iteration", () => {
      let func = x => [ x, "string: " + x ];

      let result = reduce(flatmap(func, pushMutable), [], numbersData);
      result.should.have.lengthOf(numbersData.length * 2);
      result.should.eql([
        1,  "string: 1",
        2,  "string: 2",
        3,  "string: 3",
        10, "string: 10",
        0,  "string: 0",
        -3, "string: -3"
      ]);
    });

    it("should flatten collection while preserving Reduced status", () => {
      let func = x => [ x, "string: " + x ];
      let xform = compose(flatmap(func), take(3));

      let result = reduce(xform(pushMutable), [], numbersData);
      result.should.have.lengthOf(3);
      result.should.eql([ 1,  "string: 1", 2 ]);

      let xform2 = compose(take(3), flatmap(func));

      let result2 = reduce(xform2(pushMutable), [], numbersData);
      result2.should.have.lengthOf(6);
      result2.should.eql([
        1,  "string: 1",
        2,  "string: 2",
        3,  "string: 3"
      ]);
    });
  });

  describe("filter:", () => {
    it("should return a transducer if only "
       + "predicate function is passed", () => {
      isTransducer(filter(() => {})).should.be.true;
    });

    it("should return a transformer if transformer "
       + "passed as second argument", () => {
      isTransformer(filter(() => {}, stubTransformer)).should.be.true;
    });

    it("should evaluate results when iterable is supplied", () => {
      const [ ...result1 ] = filter(even, numbersData);
      const [ ...result2 ] = filter(even)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(filter.bind(null, null, {})).to.throw(/.*/);
      expect(filter.bind(null, "a string", numbersData)).to.throw(/.*/);
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

      toArray(A(numbersData)).should.eql(numbersData
        .filter(e =>
          e * 3 > 0
        )
      );
      reduce(
        B(pushMutable),
        empty(numbersData),
        numbersData
      ).should.eql(numbersData
        .filter(e =>
          (e * 3 + 10 + 10) % 2 === 0
        )
      );
      toArray(D(numbersData)).should.eql(numbersData
        .map(e =>
          e + 10
        )
        .filter(e =>
          ((e + 10 + 10) * 3) % 2 === 0
        )
      );
      toArray(E(numbersData)).should.eql(numbersData
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
      const [ ...result1 ] = remove(even, numbersData);
      const [ ...result2 ] = remove(even)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(remove.bind(null, undefined, {})).to.throw(/.*/);
      expect(remove.bind(null, "a string", numbersData)).to.throw(/.*/);
    });

    it("can infinitely compose", () => {
      const A = remove(compose(positive, triple));
      const B = remove(compose(even, inc10, inc10, triple));
      const D = compose(
        toArray,
        remove(compose(even, triple, inc10, inc10)), map(inc10)
      );
      const E = compose(
        toArray,
        remove(positive),
        remove(compose(even, inc10, triple, triple))
      );

      toArray(A(numbersData)).should.eql(numbersData
        .filter(e =>
          e * 3 <= 0
        )
      );
      reduce(
        B(pushMutable),
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
              part = pushMutable(next, part);

            else {
              acc = pushMutable(part, acc);
              count = 1;
              part = pushMutable(next, empty(coll));
            }

            if (i === length(coll) - 1 && length(part) > 0)
              acc = pushMutable(part, acc);

            return acc;
          }, empty(coll), coll);
      })();

      toArray(partitionAll(size, coll)).should.eql(result);
      reduce(
        partitionAll(size, pushMutable),
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
              part = pushMutable(next, part);

            else {
              acc = pushMutable(part, acc);
              part = pushMutable(next, empty(coll));
            }

            value = nextVal;
            if (i === length(coll) - 1 && length(part) > 0)
              acc = pushMutable(part, acc);

            return acc;
          }, empty(coll), coll);
      })();

      toArray(partitionBy(pred, coll)).should.eql(result);
      reduce(
        partitionBy(pred, pushMutable),
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

      toArray(distinct(arr)).should.eql(result);
      reduce(distinct(pushMutable), empty(arr), arr).should.eql(result);

      const arr2 = result;

      // Already a set (distinct), no entries removed
      toArray(distinct(arr2)).should.eql(result);
      reduce(distinct(pushMutable), empty(arr), arr).should.eql(result);
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

      toArray(dedupe(arr)).should.eql(result);
      reduce(dedupe(pushMutable), empty(arr), arr).should.eql(result);

      const arr2 = result;

      // Already a set (distinct), no entries removed
      toArray(dedupe(arr2)).should.eql(result);
      reduce(dedupe(pushMutable), empty(arr), arr).should.eql(result);
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
      toArray(replace(mapObj)(array1)).should.eql(result);
      reduce(replace(mapObj)(pushMutable), empty(array1), array1)
        .should.eql(result);

      // Replace 0 elements -> should be same as original
      toArray(replace({})(array1)).should.eql(array1);
      reduce(replace({})(pushMutable), empty(array1), array1)
        .should.eql(array1);

      const mapObj2 = new Map();
      mapObj2.set(null, "null replaced");

      const arr2 = [ null ];
      const result2 = [ mapObj2.get(null) ];

      // Replace all entries
      toArray(replace(mapObj2)(arr2)).should.eql(result2);
      reduce(replace(mapObj2)(pushMutable), empty(arr2), arr2)
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

      toArray(interpose(null)(arr)).should.eql(result);
      reduce(interpose(null, pushMutable), empty(arr), arr)
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
      toArray(random(0)(array1)).should.be.a("array");
      reduce(random(1, pushMutable), empty(array1), array1)
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
      expect(random.bind(null, 100, pushMutable)).to.throw(/.*/);
    });
  });

  describe("keep:", () => {
    it("should return an iterable with elements remain when iterable "
       + "does not evaluate to null or undefined", () => {
      const arr = push(undefined, array1);
      const result = array1.filter(
        e => (e === undefined || e === null)? null: true
      );

      toArray(keep(identity)(arr)).should.eql(result);
      reduce(keep(identity, pushMutable), empty(arr), arr)
        .should.be.eql(result);

    });

    it("should call predicate with index and original iterable", () => {
      // keep passes index and original collection to the predicate function
      const index = (e, i, coll, c) =>
        (isNumber(i) && coll === array1 && isNumber(c))? true: null;

      toArray(keep(index)(array1)).should.eql(array1);
      reduce(keep(index, pushMutable), empty(array1), array1)
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
      expect(keep.bind(null, 100, pushMutable)).to.throw(/.*/);
    });
  });

  describe("take:", () => {
    it("should return a sub collection of iterable "
       + "from the head specified by count", () => {
      let result = slice(0, 2, array1);

      // Take some elements
      toArray(take(2)(array1)).should.eql(result);
      reduce(take(2)(pushMutable), empty(array1), array1).should.eql(result);

      // Take 0 elements -> should be empty
      toArray(take(0)(array1)).should.eql(empty(array1));
      reduce(take(0)(pushMutable), empty(array1), array1)
        .should.eql(empty(array1));

      // Take all elements -> should be same as original
      toArray(take(length(array1))(array1)).should.eql(array1);
      reduce(take(length(array1))(pushMutable), empty(array1), array1)
        .should.eql(array1);

      // Take more than array length -> should be same as original
      toArray(take(length(array1) + 1)(array1)).should.eql(array1);
      reduce(take(length(array1) + 1)(pushMutable), empty(array1), array1)
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
        pushMutable,
        empty(coll),
        coll
      );
      const res2 = reduce(
        takeWhile(notNumber, pushMutable),
        empty(coll),
        coll
      );
      const [ ...res3 ] = takeWhile(notNumber, coll);

      res1.should.eql(res2);
      res2.should.eql(res3);
      res3.should.eql(res1);

      // TakeWhile true -> should be same as original
      toArray(takeWhile(getTrue)(array1)).should.eql(array1);
      reduce(takeWhile(getTrue)(pushMutable), empty(array1), array1)
        .should.eql(array1);

      // TakeWhile false -> should be empty
      toArray(takeWhile(getFalse)(array1)).should.eql(empty(array1));
      reduce(takeWhile(getFalse)(pushMutable), empty(array1), array1)
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
      const tNT = takeNth(_, _, pushMutable);

      // Take every 5th starting with 0th
      toArray(tN(5, arr)).should.eql(result_5_0);
      reduce(tN(5)(pushMutable), empty(arr), arr).should.eql(result_5_0);

      // Take every 5th starting with -1st
      toArray(tN(5, -1)).should.eql(result_5_n1);
      reduce(tNT(5)(-1), empty(arr), arr)
        .should.eql(result_5_n1);

      // Take every 3rd starting with -2nd
      toArray(tN(3, -2)).should.eql(result_3_n2);
      reduce(tNT(3)(-2), empty(arr), arr)
        .should.eql(result_3_n2);

      // Take every 3rd starting with -2nd
      toArray(tN(3, 3)).should.eql(result_3_3);
      reduce(tNT(3)(3), empty(arr), arr)
        .should.eql(result_3_3);

      // Take every 100th elements -> should be empty
      toArray(tN(100, -2)).should.eql(empty(arr));
      reduce(tNT(100, -2), empty(arr), arr)
        .should.eql(empty(arr));

      // Take every 1th elements -> should be same as original
      toArray(tN(1)(arr)).should.eql(arr);
      reduce(tN(1)(pushMutable), empty(arr), arr)
        .should.eql(arr);
    });

    it("should throw an error if 'n' is not a positive number", () => {
      expect(takeNth.bind(null, 0, array1)).to.throw(/.*/);
      expect(takeNth.bind(null, -1, pushMutable)).to.throw(/.*/);
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
      toArray(drop(2)(array1)).should.eql(result);
      reduce(drop(2)(pushMutable), empty(array1), array1).should.eql(result);

      // Drop 0 elements -> should be same as original
      toArray(drop(0)(array1)).should.eql(array1);
      reduce(drop(0)(pushMutable), empty(array1), array1).should.eql(array1);

      // Drop all elements -> should be empty
      toArray(drop(length(array1))(array1)).should.eql(empty(array1));
      reduce(drop(length(array1))(pushMutable), empty(array1), array1)
        .should.eql(empty(array1));

      // Drop more than array length elements -> should be empty
      toArray(drop(length(array1) + 1)(array1)).should.eql(empty(array1));
      reduce(drop(length(array1) + 1)(pushMutable), empty(array1), array1)
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
        pushMutable,
        empty(coll),
        coll
      );
      const res2 = reduce(
        dropWhile(notNumber, pushMutable),
        empty(coll),
        coll
      );
      const [ ...res3 ] = dropWhile(notNumber, coll);

      res1.should.eql(res2);
      res2.should.eql(res3);
      res3.should.eql(res1);

      // DropWhile false -> should be same as original
      toArray(dropWhile(getFalse)(array1)).should.eql(array1);
      reduce(dropWhile(getFalse)(pushMutable), empty(array1), array1)
        .should.eql(array1);

      // DropWhile true -> should be empty
      toArray(dropWhile(getTrue)(array1)).should.eql(empty(array1));
      reduce(dropWhile(getTrue)(pushMutable), empty(array1), array1)
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

      toArray(tail(array1)).should.eql(result);
      reduce(tail(pushMutable), empty(array1), array1).should.eql(result);
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

      toArray(initial(array1)).should.eql(result);
      reduce(initial(pushMutable), empty(array1), array1).should.eql(result);
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
