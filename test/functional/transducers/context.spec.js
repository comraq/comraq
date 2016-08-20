import comraq from "./../../../src";

import {
  inc5,
  triple,
  even,
  array2, numbersData
} from "./../../test-data";

const {
  transduce, transduce1, into,
  map, filter,
  take,
  Transformer
} = comraq.functional.transducers;

const { pushMutable } = comraq.functional.arrays;
const { empty, identity, compose } = comraq.functional.library;

export default () => {
  describe("transduce:", () => {
    it("should return a function without providing a collection", () => {
      transduce(map(triple), pushMutable).should.be.a("function");
    });

    it("should get results if a collection is provided", () => {
      let coll = array2;

      let xform = compose(
        map(inc5),
        filter(even),
        take(5),
        map(triple)
      );

      transduce(xform, pushMutable, empty(coll), coll).should.eql(
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
};
