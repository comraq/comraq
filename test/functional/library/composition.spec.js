import comraq from "./../../../src";

import { inc10, triple } from "./../../test-data";

const { compose, pipe } = comraq.functional.library;

export default () => {
  const a = 10, b = -4, c = 0, d = 100;

  describe("compose:", () => {
    it("should return a function when only functions supplied", () => {
      const result = compose(inc10, triple);
      result.should.be.a("function");
    });

    it("returned function can evaluate results "
       + "in reverse function order", () => {

      const resultA = compose(inc10, triple, triple)(a);
      const resultC = compose(inc10, triple, c);
      const resultD = compose(inc10, inc10, triple, triple, inc10)(d);

      resultA.should.equal(a * 3 * 3 + 10);
      resultC.should.equal(c * 3 + 10);
      resultD.should.equal((d + 10) * 3 * 3 + 10 + 10);
    });

    it("returned function can compose and "
       + "composable with any number of functions", () => {

      const resultA = compose(compose(inc10, triple),
                        compose(triple, inc10))(a);
      const resultB = compose(
        compose(inc10),
        compose(triple, triple, inc10)
      )(b);
      const resultC = compose(compose(inc10), c);
      const resultD = compose(compose(inc10, triple), inc10, triple)(d);
      
      resultA.should.equal((a + 10) * 3 * 3 + 10);
      resultB.should.equal((b + 10) * 3 * 3 + 10);
      resultC.should.equal(c + 10);
      resultD.should.equal(((d * 3) + 10) * 3 + 10);
    });
  });

  describe("pipe:", () => {
    it("should return a function when only functions supplied", () => {
      const result = pipe(inc10, triple);
      result.should.be.a("function");
    });

    it("returned function can evaluate results "
       + "in passed in function order", () => {

      const resultA = pipe(inc10, triple, triple)(a);
      const resultC = pipe(c, inc10, triple);
      const resultD = pipe(pipe(d, inc10), inc10, inc10, triple, triple);
      
      resultA.should.equal((a + 10) * 3 * 3);
      resultC.should.equal((c + 10) * 3);
      resultD.should.equal(((d + 10) + 10 + 10) * 3 * 3);
    });

    it("returned function can pipe and "
       + "composable with any number of functions", () => {

      const resultA = pipe(pipe(inc10, triple),
                        pipe(triple, inc10))(a);
      const resultB = pipe(pipe(inc10), pipe(triple, triple, inc10))(b);
      const resultC = pipe(c, pipe(inc10));
      const resultD = pipe(pipe(inc10, triple), inc10, triple)(d);
      
      resultA.should.equal((a + 10) * 3 * 3 + 10);
      resultB.should.equal((b + 10) * 3 * 3 + 10);
      resultC.should.equal(c + 10);
      resultD.should.equal((((d + 10) * 3) + 10) * 3);
    });
  });
};
