import { compose, pipe } from "../../src/functional/composition";
import currify from "../../src/functional/currify";

export default () => {
  const a = 10, b = -4, c = 0, d = 100;

  const incBy10 = value => value + 10;
  const triple = value => value * 3;

  const inc10C = currify(incBy10);
  const tripleC = currify(triple);

  describe("compose:", () => {
    it("should return a function when only functions supplied", () => {
      const result = compose(inc10C, tripleC);
      result.should.be.a("function");
    });

    it("returned function can evaluate results "
       + "in reverse function order", () => {

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
  });

  describe("pipe:", () => {
    it("should return a function when only functions supplied", () => {
      const result = pipe(inc10C, tripleC);
      result.should.be.a("function");
    });

    it("returned function can evaluate results "
       + "in passed in function order", () => {

      const resultA = pipe(inc10C, tripleC, tripleC)(a);
      const resultB = pipe(inc10C)(tripleC)(b);
      const resultC = pipe(c, inc10C, tripleC);
      const resultD = pipe(pipe(d, inc10C), inc10C, inc10C, tripleC, tripleC);
      
      resultA.should.equal((a + 10) * 3 * 3);
      resultB.should.equal((b * 3 + 10));
      resultC.should.equal((c + 10) * 3);
      resultD.should.equal(((d + 10) + 10 + 10) * 3 * 3);
    });

    it("returned function can pipe and "
       + "currify with any number of functions", () => {

      const resultA = pipe(pipe(inc10C, tripleC),
                        pipe(tripleC, inc10C))(a);
      const resultB = pipe(inc10C)(pipe(tripleC, tripleC, inc10C))(b);
      const resultC = pipe(c, pipe(inc10C));
      const resultD = pipe(inc10C, tripleC)(inc10C)(tripleC)(d);
      
      resultA.should.equal((a + 10) * 3 * 3 + 10);
      resultB.should.equal((b * 3 * 3 + 10) + 10);
      resultC.should.equal(c + 10);
      resultD.should.equal((((d * 3) + 10) + 10) * 3);
    });
  });
};
