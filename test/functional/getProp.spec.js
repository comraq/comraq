import { compose, pipe } from "./../../src/functional/composition";
import getProp from "./../../src/functional/getProp";
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
};
