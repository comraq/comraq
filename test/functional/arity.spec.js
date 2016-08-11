import comraq from "./../../src";

const { nAry } = comraq.functional;
export default () => {
  describe("nAry", () => {
    it("should return a function", () => {
      nAry(5, () => {}).should.be.a("function");
    });

    it("should throw an error is second argument is not a function", () => {
      expect(nAry.bind(null, 0, "asdf")).to.throw(/.*/);
    });

    it("should throw an error is first argument "
       + "is not a natural number", () => {
      expect(nAry.bind(null, -1, () => {})).to.throw(/.*/);
    });

    it("should call function with the arity given", () => {
      let arityCheck = (...args) => args.length;

      nAry(5, arityCheck)(null, null, null, null, null, null).should.equal(5);
      nAry(0, arityCheck)(null, null).should.equal(0);
    });

    it("should return a curried function is number of arguments given the "
       + "fixed arity function is less than the specified arity", () => {
      let arityCheck = (...args) => args.length;

      let ac5 = nAry(5, arityCheck);

      let temp = ac5(null, null);
      temp.should.be.a("function");

      temp = temp(null);
      temp.should.be.a("function");

      temp(null, null).should.equal(5);
    });
  });
};
