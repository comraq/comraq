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

    it("should return throw an error when non-functions are composed", () => {
      const funcs = compose(inc10, "asdf");
      expect(funcs.bind(null, 10)).to.throw(/.*/);
    });

    it("returns a function that can evaluate results "
       + "in reverse function order", () => {

      const resultA = compose(inc10, triple, triple)(a);
      const resultC = compose(inc10, triple)(c);
      const resultD = compose(inc10, inc10, triple, triple, inc10)(d);

      resultA.should.equal(a * 3 * 3 + 10);
      resultC.should.equal(c * 3 + 10);
      resultD.should.equal((d + 10) * 3 * 3 + 10 + 10);
    });

    it("returns a function that can compose and "
       + "composable with any number of functions", () => {

      const resultA = compose(
        compose(inc10, triple),
        compose(triple, inc10)
      )(a);
      const resultB = compose(
        compose(inc10),
        compose(triple, triple, inc10)
      )(b);
      const resultD = compose(compose(inc10, triple), inc10, triple)(d);

      resultA.should.equal((a + 10) * 3 * 3 + 10);
      resultB.should.equal((b + 10) * 3 * 3 + 10);
      resultD.should.equal(((d * 3) + 10) * 3 + 10);
    });
  });

  describe("pipe:", () => {
    it("should return a function when only functions supplied", () => {
      const result = pipe(inc10, triple);
      result.should.be.a("function");
    });

    it("should return throw an error when non-functions are piped", () => {
      const funcs = pipe(inc10, "asdf");
      expect(funcs.bind(null, 10)).to.throw(/.*/);
    });

    it("returns a function that can evaluate results "
       + "in passed in function order", () => {

      const resultA = pipe(inc10, triple, triple)(a);
      const resultC = pipe(inc10, triple)(c);
      const resultD = pipe(pipe(inc10, inc10), inc10, triple, triple)(d);

      resultA.should.equal((a + 10) * 3 * 3);
      resultC.should.equal((c + 10) * 3);
      resultD.should.equal(((d + 10) + 10 + 10) * 3 * 3);
    });

    it("returns a function that can pipe and "
       + "composable with any number of functions", () => {

      const resultA = pipe(
        pipe(inc10, triple),
        pipe(triple, inc10)
      )(a);
      const resultB = pipe(pipe(inc10, triple), pipe(triple, inc10))(b);
      const resultD = pipe(pipe(inc10, triple), inc10, triple)(d);

      resultA.should.equal((a + 10) * 3 * 3 + 10);
      resultB.should.equal((b + 10) * 3 * 3 + 10);
      resultD.should.equal((((d + 10) * 3) + 10) * 3);
    });
  });
};
