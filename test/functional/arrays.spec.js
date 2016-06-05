import { compose } from "./../../src/functional/composition";

import {
         map,
         filter,
         reduceLeft as reduceL,
         reduceRight as reduceR
       } from "./../../src/functional/arrays";

import {
         numbersData,
         inc10,
         triple,
         even,
         positive,
         add,
         subtract
       } from "./../test-data";

export default () => {
  describe("map:", () => {
    it("should return a function when array not supplied", () => {
      const result = map(inc10);

      result.should.be.a("function");
    });

    it("should evaluate results when array is supplied", () => {
      const result1 = map(inc10, numbersData);
      const result2 = map(inc10)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(map).to.throw(/.*/);
      expect(map.bind(null, "a string", numbersData)).to.throw(/.*/);
      expect(map.bind(null, triple, "a string", numbersData)).to.throw(/.*/);
    });

    it("can infinitely compose", () => {
      const A = map(inc10(triple(inc10)));
      const B = map(inc10, inc10, triple);
      const C = map(inc10(compose(triple, inc10, inc10)));
      const D = map(inc10(compose(triple, inc10, inc10)))(map(inc10));
      const E = map(triple, inc10, inc10, numbersData);

      A(numbersData).should.deep.equal(numbersData
        .map(e =>
          (e + 10) * 3 + 10
        )
      );
      B(numbersData).should.deep.equal(numbersData
        .map(e =>
          e * 3 + 10 + 10
        )
      );
      C(numbersData).should.deep.equal(numbersData
        .map(e =>
          (e + 10 + 10) * 3 + 10
        )
      );
      D(numbersData).should.deep.equal(numbersData
        .map(e =>
          (e + 10 + 10 + 10) * 3 + 10
        )
      );

      E.should.deep.equal(numbersData
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
      const result1 = filter(even, numbersData);
      const result2 = filter(even)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(filter).to.throw(/.*/);
      expect(filter.bind(null, "a string", numbersData)).to.throw(/.*/);
      expect(filter.bind(null, triple, "a string", numbersData)).to.throw(/.*/);
    });

    it("can infinitely compose", () => {
      const A = filter(positive, triple);
      const B = filter(even, inc10, inc10, triple);
      const C = filter(even(compose(triple, inc10, inc10)));
      const D = filter(even(compose(triple, inc10, inc10)))(map(inc10));
      const E = filter(positive)(
                  filter(even, inc10, triple, triple, numbersData)
                );

      A(numbersData).should.deep.equal(numbersData
        .filter(e =>
          e * 3 > 0
        )
      );
      B(numbersData).should.deep.equal(numbersData
        .filter(e =>
          (e * 3 + 10 + 10) % 2 === 0
        )
      );
      C(numbersData).should.deep.equal(numbersData
        .filter(e =>
          ((e + 10 + 10) * 3) % 2 === 0
        )
      );
      D(numbersData).should.deep.equal(numbersData
        .map(e =>
          e + 10
        )
        .filter(e =>
          ((e + 10 + 10) * 3) % 2 === 0
        )
      );
      E.should.deep.equal(numbersData
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
      const result1 = reduceL(subtract, numbersData);
      const result2 = reduceL(subtract)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(reduceL).to.throw(/.*/);
      expect(reduceL.bind(null, "a string", numbersData)).to.throw(/.*/);
      expect(reduceL.bind(null, add, "a string", numbersData)).to.throw(/.*/);
    });

    it("should reduce array results to single value", () => {
      const A = reduceL(add);
      const B = reduceL(subtract)(map(triple));
      const C = reduceL(add)(map(inc10, triple))(filter(even));

      A(numbersData).should.equal(numbersData
        .reduce((a, b) =>
          a + b
        )
      );
      B(numbersData).should.equal(numbersData
        .map(e =>
          e * 3
        )
        .reduce((a, b) =>
          a - b
        )
      );
      C(numbersData).should.equal(numbersData
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
      const result1 = reduceR(subtract, numbersData);
      const result2 = reduceR(subtract)(numbersData);

      result1.should.deep.equal(result2);
    });

    it("should throw error with non-function before last argument", () => {
      expect(reduceR).to.throw(/.*/);
      expect(reduceR.bind(null, "a string", numbersData)).to.throw(/.*/);
      expect(reduceR.bind(null, add, "a string", numbersData)).to.throw(/.*/);
    });

    it("should reduce array results to single value", () => {
      const A = reduceR(add);
      const B = reduceR(subtract)(map(triple));
      const C = reduceR(add)(map(inc10, triple))(filter(even));
      const D = reduceR(add);
      const E = reduceR(subtract);

      A(numbersData).should.equal(numbersData
        .reduceRight((a, b) =>
          a + b
        )
      );
      B(numbersData).should.equal(numbersData
        .map(e =>
          e * 3
        )
        .reduceRight((a, b) =>
          a - b
        )
      );
      C(numbersData).should.equal(numbersData
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
      D(numbersData).should.equal(reduceL(add, numbersData));
      E(numbersData).should.not.equal(reduceL(subtract, numbersData));
    });
  });
};
