import { compose } from "./../../src/functional/composition";
import { trace } from "./../../src/functional/utils";

import {
         map,
         filter,
         reduce as reduceL,
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
      expect(map.bind(null, undefined, undefined)).to.throw(/.*/);
      expect(map.bind(null, "a string", numbersData)).to.throw(/.*/);
      expect(map.bind(null, triple, "a string", numbersData)).to.throw(/.*/);
    });

    it("can infinitely compose", () => {
      const B = map(compose(inc10, inc10, triple));
      const C = compose(map(inc10), map(compose(triple, inc10, inc10)));
      const E = map(compose(triple, inc10, inc10))(numbersData);

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
      expect(filter.bind(null, inc10, {})).to.throw(/.*/);
      expect(filter.bind(null, "a string", numbersData)).to.throw(/.*/);
      expect(filter.bind(null, triple, "a string", numbersData)).to.throw(/.*/);
    });

    it("can infinitely compose", () => {
      const A = filter(compose(positive, triple));
      const B = filter(compose(even, inc10, inc10, triple));
      const D = compose(
                  filter(compose(even, triple, inc10, inc10)), map(inc10)
                );
      const E = compose(
                  filter(positive),
                  filter(compose(even, inc10, triple, triple))
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
      D(numbersData).should.deep.equal(numbersData
        .map(e =>
          e + 10
        )
        .filter(e =>
          ((e + 10 + 10) * 3) % 2 === 0
        )
      );
      E(numbersData).should.deep.equal(numbersData
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
      expect(reduceL.bind(null, add, null)).to.throw(/.*/);
      expect(reduceL.bind(null, "a string", numbersData)).to.throw(/.*/);
      expect(reduceL.bind(null, add, "a string", numbersData)).to.throw(/.*/);
    });

    it("should reduce array results to single value", () => {
      const A = reduceL(add);
      const B = compose(reduceL(subtract), map(triple));
      const C = compose(
        reduceL(add),
        map(compose(inc10, triple)),
        filter(even)
      );

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
      expect(reduceR.bind(null, add, null)).to.throw(/.*/);
      expect(reduceR.bind(null, "a string", numbersData)).to.throw(/.*/);
      expect(reduceR.bind(null, add, "a string", numbersData)).to.throw(/.*/);
    });

    it("should reduce array results to single value", () => {
      const A = reduceR(add);
      const B = compose(reduceR(subtract), map(triple));
      const C = compose(
        reduceR(add),
        map(compose(inc10, triple)),
        filter(even)
      );
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
