import comraq from "./../../src";

import {
         array2, numbersData
       } from "./../test-data";

const { join, concat, concatMutable } = comraq.functional.algebraic;

export default () => {
  const s1 = "aSdf";
  const s2 = "1234";

  const a1 = [ "a", "b" ];
  const a2 = [ false ];

  describe("semigroup:", () => {
    describe("concat:", () => {
      it("should concatenate two semigroups", () => {
        concat(s1)(s2).should.equal("aSdf1234");
        concat(a1, a2).should.deep.equal([ "a", "b", false ]);
      });

      it("should concatenate 2 arrays", () => {
        concat(array2, numbersData).should.eql(
          array2.concat(numbersData)
        );
      });

      it("should not mutate original array", () => {
        concat(array2, []).should.not.equal(array2);

        let newLength = array2.length + 1;
        concat(array2, [ 2 ]).length.should.equal(newLength);
      });

      it("should throw error if source and "
         + "target semi-groups are not of the same type", () => {
        expect(concat.bind(null, "asdf", [])).to.throw(/.*/);
        expect(concat.bind(null, [], {})).to.throw(/.*/);
      });
    });

    describe("concatMutable:", () => {
      it("should concatenate two semigroups", () => {
        concat(s1)(s2).should.equal("aSdf1234");
        concat(a1, a2).should.deep.equal([ "a", "b", false ]);
      });

      it("should concatenate 2 arrays", () => {
        let result = [ ...array2, ...numbersData ];
        concatMutable(array2, numbersData).should.eql(result);
      });

      it("should mutate original array", () => {
        concatMutable(array2, []).should.equal(array2);

        let newLength = array2.length + 1;
        concatMutable(array2, [ 2 ]).length.should.equal(newLength);
      });

      it("should throw error if source and "
         + "target semi-groups are not of the same type", () => {
        expect(concatMutable.bind(null, "asdf", [])).to.throw(/.*/);
        expect(concatMutable.bind(null, [], {})).to.throw(/.*/);
      });
    });
  });

  describe("monad:", () => {
    describe("join:", () => {
      it("should join/flatten two monads", () => {
        expect.fail(join, null, "test not implemented");
      });
    });
  });
};
