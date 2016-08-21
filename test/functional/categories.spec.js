import comraq from "./../../src";

const { Functor, Applicative } = comraq.functional.categories;

export default () => {
  describe("Functors:", () => {
    it("can be implemented via the 'implement' method", () => {
      Functor.implement.should.be.a("function");
    });

    it("implementations are instanceof Functor", () => {
      const implementation = {
        fmap: () => {}
      };
      const myclass = Functor.implement({}, implementation);

      const functor = Object.create(myclass);
      functor.should.be.an.instanceof(Functor);
    });

    it("implementations without a fmap function will throw error", () => {
      const implementation = { fmap: "not a function" };
      expect(Functor.implement.bind(null, {}, implementation)).to.throw(/.*/);
    });

    it("calling fmap of functors with a non-function will throw error", () => {
      const implementation = { fmap: () => {} };
      const myclass = Functor.implement({}, implementation);

      const functor = Object.create(myclass);
      expect(functor.fmap.bind(null, "not a function")).to.throw(/.*/);
    });
  });

  const functorClass = Functor.implement({}, {
    fmap: () => {}
  });
  describe("Applicatives:", () => {
    it("can be implemented via the 'implement' method", () => {
      Applicative.implement.should.be.a("function");
    });

    it("Non-Functors implementing Applicative will throw error", () => {
      const implementation = {
        of: () => {},
        ap: () => {}
      };
      expect(Applicative.implement.bind(null, {}, implementation)).to.throw(/.*/);
    });

    it("implementations are instanceof Applicative", () => {
      const implementation = {
        of: () => {},
        ap: () => {}
      };
      const applicativeClass = Applicative.implement(functorClass, implementation);

      const applicative = Object.create(applicativeClass);
      applicative.should.be.an.instanceof(Applicative);
    });

    it("implementations without an of function will throw error", () => {
      const implementation = {
        of: "not a function",
        ap: () => {}
      };
      expect(Applicative.implement.bind(null, functorClass, implementation)).to.throw(/.*/);
    });

    it("implementations without an ap function will throw error", () => {
      const implementation = {
        of: () => {},
        ap: "not a function"
      };
      expect(Applicative.implement.bind(null, functorClass, implementation)).to.throw(/.*/);
    });

    it("calling ap on applicatives of different classes will throw error", () => {
      const implementation = {
        fmap: () => {},
        of: () => {},
        ap: () => {}
      };
      const applicativeClass = Applicative.implement(functorClass, implementation);

      const anotherClass = Applicative.implement(
        Functor.implement({}, implementation),
        implementation
      );

      const ap1 = Object.create(applicativeClass);
      const ap2 = Object.create(anotherClass);

      expect(ap1.ap.bind(null, ap2)).to.throw(/.*/);
    });
  });
};
