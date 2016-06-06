import curry from "./../../src/functional/curry";
import composable from "./../../src/functional/composable";
import { compose, pipe } from "./../../src/functional/composition";
import { getProp, withProp } from "./../../src/functional/prop";
import {
         map,
         filter,
         reduceLeft as reduce
       } from "./../../src/functional/arrays";

import {
         namesData,
         positive,
         upper,
         triple,
         add
       } from "./../test-data";

export default () => {
  describe("getProp:", () => {
    it("should return a function", () => {
      getProp("some-prop").should.be.a("function");
      getProp(123).should.be.a("function");
    });

    it("should throw error when prop is not string or number", () => {
      expect(getProp).to.throw(/.*/);
      expect(getProp.bind(null, [], 1234)).to.throw(/.*/);
      expect(getProp.bind(null, {}, "a string")).to.throw(/.*/);
      expect(getProp.bind(null, null, "a string")).to.throw(/.*/);
      expect(getProp.bind(null, true, "a string")).to.throw(/.*/);
    });

    it("should get value if prop and target are passed", () => {
      getProp("asdf", { asdf: 23 }).should.equal(23);
      getProp(1, [ true, "string-asdf" ]).should.equal("string-asdf");
      expect(getProp("asdf", false)).to.equal(null);
    });

    it("can be used in composition with other functions", () => {
      const A = compose(
        map(upper, getProp("name")),
        filter(positive, getProp("id"))
      );

      const B = pipe(namesData, getProp(0), getProp("id"), triple);
      const C = compose(triple, getProp("id"), getProp(0));
      const D = reduce(add)(A);
    
      A(namesData).should.deep.equal([ "ADAM", "COMRAQ", "YIN" ]);
      B.should.equal(namesData[0]["id"] * 3);
      C(namesData).should.equal(namesData[0]["id"] * 3);
      D(namesData).should.equal("ADAMCOMRAQYIN");
    });
  });

  describe("withProp:", () => {
    it("should return a function", () => {
      withProp("some-prop", "value").should.be.a("function");
      withProp(123).should.be.a("function");
    });

    it("should throw error when prop is not string or number", () => {
      expect(withProp).to.throw(/.*/);
      expect(withProp.bind(null, [], 1234)).to.throw(/.*/);
      expect(withProp.bind(null, {}, "a string")).to.throw(/.*/);
      expect(withProp.bind(null, null, "a string")).to.throw(/.*/);
      expect(withProp.bind(null, true, "a string")).to.throw(/.*/);
    });

    it("should return new object if prop, value and target are passed", () => {
      const temp = { a: true };

      const A = withProp("asdf", { asdf: 23 }, temp);
      A.should.deep.equal({ a: true, asdf: { asdf: 23 } });

      const B = withProp(1, [ true, "string-asdf" ], 123);
      B.should.deep.equal({ "1": [ true, "string-asdf" ]});

      const C = withProp("jkl", undefined, []);
      C.should.deep.equal({ "jkl": null });
    });

    it("should return a copy of target object", () => {
      const temp = { a: true };

      const A  = withProp("asdf", { asdf: 23 }, temp);
      A.should.not.equal(temp);
    });

    it("can be used in composition with other functions", () => {
      const A = pipe(namesData, filter(positive, withProp("id", -1)));
      A.should.deep.equal([]);

      const lengthLT = composable((len, e) => e.length < len);
      let lenLT5 = curry(lengthLT, 5);

      const B = compose(
        map(upper, getProp(2), withProp(2, "random")),
        filter(lenLT5, getProp("name"))
      );

      B(namesData).should.deep.equal([ "RANDOM", "RANDOM" ]);
    });
  });
};
