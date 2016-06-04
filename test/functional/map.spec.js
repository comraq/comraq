import map from "../../src/functional/map";
import currify from "../../src/functional/currify";
import compose from "../../src/functional/compose";

export default () => {
  const testData = [ 1, 2, 3 ];

  const inc10C = currify(value => value + 10);
  const tripleC = currify(value => value * 3);

  it("should return a function when array not supplied", () => {
    const result = map(inc10C);
    result.should.be.a("function");
  });

  it("should evaluate results when array is supplied", () => {
    const result1 = map(inc10C, testData);
    const result2 = map(inc10C)(testData);

    result1.should.deep.equal(result2);
  });

  it("should throw error with non-function before last argument", () => {
    expect(map).to.throw(/.*/);
    expect(map.bind(null, "a string", testData)).to.throw(/.*/);
    expect(map.bind(null, tripleC, "a string", testData)).to.throw(/.*/);
  });

  it("can infinitely compose", () => {
    const A = map(inc10C(tripleC(inc10C)));
    const B = map(inc10C, inc10C, tripleC);
    const C = map(inc10C(compose(tripleC, inc10C, inc10C)));
    const D = map(inc10C(compose(tripleC, inc10C, inc10C)))(map(inc10C));
    const E = map(tripleC, inc10C, inc10C, testData);

    A(testData).should.deep.equal(testData.map(e => (e + 10) * 3 + 10));
    B(testData).should.deep.equal(testData.map(e => e * 3 + 10 + 10));
    C(testData).should.deep.equal(testData.map(e => (e + 10 + 10) * 3 + 10));
    D(testData).should.deep.equal(testData.map(
      e => (e + 10 + 10 + 10) * 3 + 10)
    );

    E.should.deep.equal(testData.map(e => (e + 10 + 10) * 3));
  });
};
