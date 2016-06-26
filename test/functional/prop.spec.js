import comraq from "./../../src";

import {
         namesData,
         positive,
         triple,
         add
       } from "./../test-data";

const {
  curry, composable, compose, pipe,
  getProp, withProp, hasProp
} = comraq.functional;

const { upper } = comraq.functional.strings;
const { reduce1 } = comraq.functional.iterables;
const { map, filter } = comraq.functional.transducers;

export default () => {
  describe("getProp:", () => {
    it("should return a function", () => {
      getProp("some-prop").should.be.a("function");
      getProp(123).should.be.a("function");
    });

    it("should throw error when prop is not string or number", () => {
      expect(getProp.bind(null, undefined, true)).to.throw(/.*/);
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
        map(compose(upper, getProp("name"))),
        filter(compose(positive, getProp("id")))
      );

      const B = pipe(namesData, getProp(0), getProp("id"), triple);
      const C = compose(triple, getProp("id"), getProp(0));
      const D = compose(reduce1(add), A);
    
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
      expect(withProp.bind(null, false, null, undefined)).to.throw(/.*/);
      expect(withProp.bind(null, [], 1234, true)).to.throw(/.*/);
      expect(withProp.bind(null, {}, "a string", null)).to.throw(/.*/);
      expect(withProp.bind(null, null, "a string", undefined)).to.throw(/.*/);
      expect(withProp.bind(null, true, "a string", 1)).to.throw(/.*/);
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
      const A = pipe(namesData, filter(compose(positive, withProp("id", -1))));
      A.should.deep.equal([]);

      const lengthLT = composable((len, e) => e.length < len);
      let lenLT5 = curry(lengthLT, 5);

      const B = compose(
        map(compose(upper, getProp(2), withProp(2, "random"))),
        filter(compose(lenLT5, getProp("name")))
      );

      B(namesData).should.deep.equal([ "RANDOM", "RANDOM" ]);
    });
  });

  describe("hasProp:", () => {
    it("should return a function", () => {
      hasProp("some-prop").should.be.a("function");
      hasProp({}).should.be.a("function");
    });

    it("should return boolean if prop and target are passed", () => {
      hasProp("asdf", { asdf: 23 }).should.be.true;
      hasProp("asdf", false).should.be.false;
      hasProp("asdf", new Map([ [ "asdf", null ] ])).should.be.true;
    });
  });
};
