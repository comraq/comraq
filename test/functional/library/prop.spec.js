import comraq from "./../../../src";

import {
  namesData,
  positive,
  triple,
  add
} from "./../../test-data";

const {
  curry, compose, pipe,
  getProp, withProp, hasProp, placeholder: _
} = comraq.functional.library;

const { upper } = comraq.functional.strings;
const { toArray, reduce1 } = comraq.functional.iterables;
const { map, filter } = comraq.functional.transducers;

export default () => {
  describe("getProp:", () => {
    it("should return a function", () => {
      getProp("some-prop").should.be.a("function");
      getProp(123).should.be.a("function");
    });

    it("should get value if prop and target are passed", () => {
      getProp("asdf", { asdf: 23 }).should.equal(23);
      getProp(1, [ true, "string-asdf" ]).should.equal("string-asdf");
      expect(getProp("asdf", false)).to.equal(null);
    });

    it("can be used in composition with other functions", () => {
      const A = compose(
        toArray,
        map(compose(upper, getProp("name"))),
        filter(compose(positive, getProp("id")))
      );

      const B = pipe(getProp(0), getProp("id"), triple);
      const C = compose(triple, getProp("id"), getProp(0));
      const D = compose(reduce1(add), A);

      A(namesData).should.eql([ "ADAM", "COMRAQ", "YIN" ]);
      B(namesData).should.equal(namesData[0]["id"] * 3);
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
      A.should.eql({ a: true, asdf: { asdf: 23 } });

      const B = withProp(1, [ true, "string-asdf" ], 123);
      assert.equal(123, B);
      B.should.have.deep.property("1.[0]", true);
      B.should.have.deep.property("1.[1]", "string-asdf");

      const C = withProp("jkl", undefined, []);
      C.should.have.property("jkl", undefined);
    });

    it("should return a copy of target object", () => {
      const temp = { a: true };

      const A  = withProp("asdf", { asdf: 23 }, temp);
      A.should.not.equal(temp);
    });

    it("should mutate original object if mutate flag is set", () => {
      const mWithProp = withProp(_, _, _, true);

      const orig = {};

      const result = mWithProp("abc", undefined, orig);
      result.should.eql(orig);
      result.should.have.ownProperty("abc");
      expect(result.abc).to.be.undefined;
    });

    it("should not coerce numbers into strings when setting properties "
       + "on arrays", () => {
      const mWithProp = withProp(_, _, _, true);

      const orig = [];

      const result = mWithProp(9, null, orig);
      result.should.eql(orig);

      expect(result[9]).to.be.null;
      expect(result["2"]).to.be.undefined;
    });

    it("can be used in composition with other functions", () => {
      const A = pipe(
        filter(compose(positive, withProp("id", -1))),
        toArray
      );
      A(namesData).should.eql([]);

      const lengthLT = (len, e) => e.length < len;
      let lenLT5 = curry(lengthLT, 5);

      const B = compose(
        toArray,
        map(compose(upper, getProp(2), withProp(2, "random"))),
        filter(compose(lenLT5, getProp("name")))
      );

      B(namesData).should.eql([ "RANDOM", "RANDOM" ]);
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
