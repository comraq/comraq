import comraq from "./../../../src";

const { empty } = comraq.functional.library;

export default () => {
  it("should return empty array for type Array", () => {
    const a1 = [ null, true ];
    const a2 = [];

    empty(a1).should.eql([]);
    empty(a2).should.eql([]);
  });

  it("should not mutate original array", () => {
    const a1 = [ null, true ];
    const a2 = [];

    empty(a1).should.not.equal(a1);
    empty(a2).should.not.equal(a2);
  });

  it("should return empty objects for type Object", () => {
    const o1 = { b: null, a: true };
    const o2 = {};

    empty(o1).should.eql({});
    empty(o2).should.eql({});
  });

  it("should not mutate original objects", () => {
    const o1 = { b: null, a: true };
    const o2 = {};

    empty(o1).should.not.equal(o1);
    empty(o2).should.not.equal(o2);
  });

  it("should return empty string for type String", () => {
    const s1 = "true";
    const s2 = "";

    empty(s1).should.eql("");
    empty(s2).should.eql("");
  });
};
