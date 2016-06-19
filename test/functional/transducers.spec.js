import comraq from "./../../src";

import {
         inc5,
         triple,
         even,
         array2
       } from "./../test-data";

const {
  transduce,
  map,
  filter,
  take,
  partitionAll
} = comraq.functional.transducers;

const { concatMutable, concatTM } = comraq.functional.algebraic;
const { compose } = comraq.functional;
const { length } = comraq.functional.strings;

export default () => {
  describe("transduce:", () => {
    it("should return a function without providing a collection", () => {
      transduce(map(triple), concatTM).should.be.a("function");
    });

    it("should get results if a collection is provided", () => {
      let coll = array2;

      let xform = compose(
        map(inc5),
        filter(even),
        take(5),
        map(triple)
      );

      transduce(xform, concatTM, coll.empty(), coll).should.deep.equal(
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

  describe("partitionAll:", () => {
    it("should partition a collection into "
       + "an array of sub-collections (partitions)", () => {
      let coll = array2;
      let size = 3;
      let count = 0;
      let part = coll.empty();

      let xform = compose(
        partitionAll(size),
        take(5)
      );
      
      let result = transduce(xform, concatTM, coll.empty(), coll);
      console.log(JSON.stringify(result));

      result.should.deep.equal(
        array2
          .reduce((acc, next, i, coll) => {
            if (count++ < size)
              part = concatMutable(part, next);

            else {
              acc = concatMutable(acc, part);
              count = 1;
              part = concatMutable(coll.empty(), next);
            }

            if (i === length(coll) - 1 && length(part) > 0)
              acc = concatMutable(acc, part);

            return acc;
          }, coll.empty())
          .slice(0, 5)
      );
    });
  });
};
