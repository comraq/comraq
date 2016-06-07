import composable from "./../../src/functional/composable";
import { compose, pipe } from "./../../src/functional/composition";

import {
         map,
         filter,
         reduce
       } from "./../../src/functional/arrays";

import { namesData, numbersData } from "./../test-data";

export default () => {
  const incBy10 = numbers => numbers.map(arg => arg + 10);
  const triple = numbers => numbers.map(arg => arg * 3);

  it("should return a function", () => {
    const result = composable(incBy10);

    result.should.be.a("function");
  });

  it("should throw error with non-function as first argument", () => {
    expect(composable).to.throw(/.*/);
    expect(composable.bind(null, "a string")).to.throw(/.*/);
    expect(composable.bind(null, "a string", incBy10)).to.throw(/.*/);
  });

  it("composable function should evaluate results "
     + "if non-function is passed as first argument", () => {
    const add = (a, b = -1, c = -3) => a + b + c;
    const addC = composable(add);

    addC(10, 11, 12).should.equal(add(10, 11, 12));
    addC(10).should.equal(add(10));
  });

  it("composable function should return a function "
     + "if function is passed as first argument", () => {
    const inc10C = composable(incBy10);

    inc10C(() => {}).should.be.a("function");
  });

  it("composable function should be composable "
     + "with non-composable functions", () => {
    const tripleC = composable(triple);
    const inc10ThenTriple = tripleC(incBy10);

    inc10ThenTriple.should.be.a("function");
    inc10ThenTriple(numbersData).should.deep.equal(numbersData
      .map(e =>
        (e + 10) * 3
      )
    );
  });

  it("composable function composed with non-composable functions "
     + "cannot be further composed", () => {
    const tripleC = composable(triple);
    const inc10ThenTriple = tripleC(incBy10);

    expect(inc10ThenTriple.bind(null, incBy10)).to.throw(/.*/);
  });

  it("composable functions can infinitely compose", () => {
    const tripleC = composable(triple);
    const inc10C = composable(incBy10);

    let temp = inc10C;
    for (let i = 0; i < 9; ++i)
      temp = inc10C(temp);

    const inc100Triple = tripleC(temp);

    inc100Triple.should.be.a("function");
    inc100Triple(numbersData).should.deep.equal(
      numbersData.map(e => (e + 10 * 10) * 3)
    );
  });

  it("works with map, reduce and filter", () => {
    // Map Functions
    const capNames = e =>
      Object.assign({}, e, { name: e.name.toUpperCase() });
    const repeatOnce = e =>
      Object.assign({}, e, { name: e.name + e.name });

    const capFirst = e =>
      Object.assign({}, e, {
        name: e.name.split(" ")
                .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
                .join(" ")
      });

    // Filter Functions
    const legalName = e =>
      e.type === "first name" || e.type === "last name";

    const realName = e => e.type !== "username";

    const oneWord = e => e.name.split(" ").length === 1;

    // Reduce Functions
    const fullName = (curr, next) =>
      curr.name + ` ${next.name}`;

    const getFullCapsName = compose(
      reduce(fullName),
      filter(legalName),
      map(capNames)
    );
    const getFullName = compose(
      reduce(fullName),
      filter(legalName),
      map(capFirst)
    );
    const getFrequentName = pipe(
      map(compose(repeatOnce, capFirst)),
      filter(oneWord),
      filter(realName),
      reduce(fullName)
    );

    getFullCapsName(namesData).should.equal("YIN YI RAN");
    getFullName(namesData).should.equal("Yin Yi Ran");
    getFrequentName(namesData).should.equal("AdamAdam YinYin");
  });
};
