import comraq from "./../../src";

import { array1 } from "./../test-data";

const { slice } = comraq.functional.arrays;

export default () => {
  describe("slice:", () => {
    it("should return a sub-array or substring", () => {
      const s = "asdfg";

      slice(0, 3)(s).should.equal("asd");
      slice(2)(4)(array1).should.deep.equal([ null, s ]);
    });
  });
};
