import curry from "../../src/functional/curry";

export default () => {
  describe("curry:", () => {
    it("should return a function", () => {
      curry(() => {}).should.be.a("function");
    });

    it("should throw error with non-function as first argument", () => {
      expect(curry).to.throw(/.*/);
      expect(curry.bind(null, "a string")).to.throw(/.*/);
      expect(curry.bind(null, "a string", () => {})).to.throw(/.*/);
    });

    it("can curry function with 1 argument", () => {
      const add = (a, b, c) => a + b + c;

      const add10 = curry(add, 10);
      add10(1, 2).should.equal(10 + 1 + 2);
    });

    it("can curry function with multiple arguments", () => {
      const add = (a, b, c) => a + b + c;

      const add10And11 = curry(add, 10, 11);
      add10And11(1).should.equal(10 + 11 + 1);

      const add10And11And12 = curry(add, 10, 11, 12);
      add10And11And12().should.equal(10 + 11 + 12);
      add10And11And12("more args", "should not affect result", 99).should.equal(
        10 + 11 + 12
      );
    });

    it("can repeatedly curry functions", () => {
      const add = (a, b, c) => a + b + c;

      const add10And11And12 = curry(curry(curry(add, 10), 11), 12);
      add10And11And12().should.equal(10 + 11 + 12);
    });
  });

  describe("autoCurry:", () => {
    it("should return a function", () => {
      expect.fail(true, true, "autoCurry not yet implemented");
    });
  });
};
