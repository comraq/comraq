import compose from "../../src/functional/compose";
import currify from "../../src/functional/currify";

export default () => {
  const incBy10 = value => value + 10;
  const triple = value => value * 3;

  const inc10C = currify(incBy10);
  const tripleC = currify(triple);

  it("should return a function when only functions supplied", () => {
    const result = compose(inc10C, tripleC);
    result.should.be.a("function");
  });

  it("returned function can evaluate results in reverse function order", () => {
    const a = 10, b = -4, c = 0, d = 100;

    const resultA = compose(inc10C, tripleC, tripleC)(a);
    const resultB = compose(inc10C)(tripleC)(b);
    const resultC = compose(inc10C, tripleC, c);
    const resultD = compose(inc10C, inc10C, tripleC, tripleC)(inc10C)(d);
    
    resultA.should.equal(a * 3 * 3 + 10);
    resultB.should.equal(b * 3 + 10);
    resultC.should.equal(c * 3 + 10);
    resultD.should.equal((d + 10) * 3 * 3 + 10 + 10);
  });

  it("returned function can compose and "
     + "currify with any number of functions", () => {
    const a = 10, b = -4, c = 0, d = 100;

    const resultA = compose(compose(inc10C, tripleC),
                      compose(tripleC, inc10C))(a);
    const resultB = compose(inc10C)(compose(tripleC, tripleC, inc10C))(b);
    const resultC = compose(compose(inc10C), c);
    const resultD = compose(inc10C, tripleC)(inc10C)(tripleC)(d);
    
    resultA.should.equal((a + 10) * 3 * 3 + 10);
    resultB.should.equal((b + 10) * 3 * 3 + 10);
    resultC.should.equal(c + 10);
    resultD.should.equal(((d * 3) + 10) * 3 + 10);
  });
};
