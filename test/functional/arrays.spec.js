import currify from "./../../src/functional/currify";
import { compose } from "./../../src/functional/composition";

import {
         map,
         filter,
         reduceLeft as reduceL,
         reduceRight as reduceR
       } from "./../../src/functional/arrays";

export default () => {
  const testData = [ 1, 2, 3, 10, 0, -3 ];

  const inc10C = currify(value => value + 10);
  const tripleC = currify(value => value * 3);

  const even = currify(value => value % 2 === 0);
  const positive = currify(value => value > 0);

  const add = currify((valA, valB) => valA + valB);
  const subtract = currify((valA, valB) => valA - valB);

  describe("map:", () => {
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

      A(testData).should.deep.equal(testData
        .map(e =>
          (e + 10) * 3 + 10
        )
      );
      B(testData).should.deep.equal(testData
        .map(e =>
          e * 3 + 10 + 10
        )
      );
      C(testData).should.deep.equal(testData
        .map(e =>
          (e + 10 + 10) * 3 + 10
        )
      );
      D(testData).should.deep.equal(testData
        .map(e =>
          (e + 10 + 10 + 10) * 3 + 10
        )
      );

      E.should.deep.equal(testData
        .map(e =>
          (e + 10 + 10) * 3
        )
      );
    });
  });

  describe("filter:", () => {
    it("should return a function when array not supplied", () => {
      const result = filter(even);

      result.should.be.a("function");
    });

    it("should evaluate results when array is supplied", () => {
      const result1 = filter(even, testData);
      const result2 = filter(even)(testData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(filter).to.throw(/.*/);
      expect(filter.bind(null, "a string", testData)).to.throw(/.*/);
      expect(filter.bind(null, tripleC, "a string", testData)).to.throw(/.*/);
    });

    it("can infinitely compose", () => {
      const A = filter(positive, tripleC);
      const B = filter(even, inc10C, inc10C, tripleC);
      const C = filter(even(compose(tripleC, inc10C, inc10C)));
      const D = filter(even(compose(tripleC, inc10C, inc10C)))(map(inc10C));
      const E = filter(positive)(
                  filter(even, inc10C, tripleC, tripleC, testData)
                );

      A(testData).should.deep.equal(testData
        .filter(e =>
          e * 3 > 0
        )
      );
      B(testData).should.deep.equal(testData
        .filter(e =>
          (e * 3 + 10 + 10) % 2 === 0
        )
      );
      C(testData).should.deep.equal(testData
        .filter(e =>
          ((e + 10 + 10) * 3) % 2 === 0
        )
      );
      D(testData).should.deep.equal(testData
        .map(e =>
          e + 10
        )
        .filter(e =>
          ((e + 10 + 10) * 3) % 2 === 0
        )
      );
      E.should.deep.equal(testData
        .filter(e =>
          (e * 3 * 3 + 10) % 2 === 0 && e > 0
        )
      );
    });
  });

  describe("reduceLeft:", () => {
    it("should return a function when array not supplied", () => {
      const result = reduceL(add);
      result.should.be.a("function");
    });

    it("should evaluate results when array is supplied", () => {
      const result1 = reduceL(subtract, testData);
      const result2 = reduceL(subtract)(testData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(reduceL).to.throw(/.*/);
      expect(reduceL.bind(null, "a string", testData)).to.throw(/.*/);
      expect(reduceL.bind(null, add, "a string", testData)).to.throw(/.*/);
    });

    it("should reduce array results to single value", () => {
      const A = reduceL(add);
      const B = reduceL(subtract)(map(tripleC));
      const C = reduceL(add)(map(inc10C, tripleC))(filter(even));

      A(testData).should.equal(testData
        .reduce((a, b) =>
          a + b
        )
      );
      B(testData).should.equal(testData
        .map(e =>
          e * 3
        )
        .reduce((a, b) =>
          a - b
        )
      );
      C(testData).should.equal(testData
        .filter(e =>
          e % 2 === 0
        )
        .map(e =>
          e * 3 + 10
        )
        .reduce((a, b) =>
          a + b
        )
      );
    });

  });

  describe("reduceRight:", () => {
    it("should return a function when array not supplied", () => {
      const result = reduceR(add);

      result.should.be.a("function");
    });

    it("should evaluate results when array is supplied", () => {
      const result1 = reduceR(subtract, testData);
      const result2 = reduceR(subtract)(testData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(reduceR).to.throw(/.*/);
      expect(reduceR.bind(null, "a string", testData)).to.throw(/.*/);
      expect(reduceR.bind(null, add, "a string", testData)).to.throw(/.*/);
    });

    it("should reduce array results to single value", () => {
      const A = reduceR(add);
      const B = reduceR(subtract)(map(tripleC));
      const C = reduceR(add)(map(inc10C, tripleC))(filter(even));
      const D = reduceR(add);
      const E = reduceR(subtract);

      A(testData).should.equal(testData
        .reduceRight((a, b) =>
          a + b
        )
      );
      B(testData).should.equal(testData
        .map(e =>
          e * 3
        )
        .reduceRight((a, b) =>
          a - b
        )
      );
      C(testData).should.equal(testData
        .filter(e =>
          e % 2 === 0
        )
        .map(e =>
          e * 3 + 10
        )
        .reduceRight((a, b) =>
          a + b
        )
      );
      D(testData).should.equal(reduceL(add, testData));
      E(testData).should.not.equal(reduceL(subtract, testData));
    });
  });
};
