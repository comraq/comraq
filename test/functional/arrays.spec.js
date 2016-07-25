import comraq from "./../../src";

import { array1, array2, numbersData } from "./../test-data";

const { slice, push, pushMutable } = comraq.functional.arrays;

export default () => {
  describe("slice:", () => {
    it("should return a sub-array or substring", () => {
      const s = "asdfg";

      slice(0, 3)(s).should.equal("asd");
      slice(2)(4)(array1).should.deep.equal([ null, s ]);
    });
  });

  describe("push:", () => {
    it("should push an element to the end of an array", () => {
      push(numbersData, array2).should.eql(
        [ ...array2, numbersData ]
      );
    });

    it("should not mutate original array", () => {
      push([], array2).should.not.equal(array2);

      let newLength = array2.length + 1;
      push(2, array2).length.should.equal(newLength);
    });

    it("should throw error if array param is not of type Array", () => {
      expect(push.bind(null, "asdf", 123)).to.throw(/.*/);
      expect(push.bind(null, [], {})).to.throw(/.*/);
    });
  });

  describe("pushMutable:", () => {
    it("should push an element to the end of an array", () => {
      let result = [ ...array2, numbersData ];
      pushMutable(numbersData, array2).should.eql(result);
    });

    it("should mutate original array", () => {
      pushMutable([], array2).should.equal(array2);

      let newLength = array2.length + 1;
      pushMutable(2, array2).length.should.equal(newLength);
    });

    it("should throw error if array param is not of type Array", () => {
      expect(pushMutable.bind(null, "asdf", 123)).to.throw(/.*/);
      expect(pushMutable.bind(null, [], {})).to.throw(/.*/);
    });
  });
};
