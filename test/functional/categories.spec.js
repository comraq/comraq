import comraq from "./../../src";

const { Functor } = comraq.functional.categories;

export default () => {
  describe("Functors:", () => {
    it("can be implemented via the 'implement' method", () => {
      Functor.implement.should.be.a("function");
    });

    it("implementations are instanceof Functor", () => {
      const implementation = {
        fmap: () => {}
      };
      const functor = Functor.implement({}, implementation);
      functor.should.be.an.instanceof(Functor);
    });

    it("implementations without a fmap function will throw error", () => {
      const implementation = { fmap: "not a function" };
      expect(Functor.implement.bind(null, {}, implementation)).to.throw(/.*/);
    });

    it("calling fmap of functors with a non-function will throw error", () => {
      const implementation = { fmap: () => {} };
      const functor = Functor.implement({}, implementation);

      expect(functor.fmap.bind(null, "not a function")).to.throw(/.*/);
    });
  });
};
