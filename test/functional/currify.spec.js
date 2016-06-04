import currify from "./../../src/functional/currify";
import { compose, pipe } from "./../../src/functional/composition";

import {
         map,
         filter,
         reduceLeft as reduce
       } from "./../../src/functional/arrays";

export default () => {
  const testData = [ 1, 2, 3 ];

  const incBy10 = numbers => numbers.map(arg => arg + 10);
  const triple = numbers => numbers.map(arg => arg * 3);

  it("should return a function", () => {
    const result = currify(incBy10);

    result.should.be.a("function");
  });

  it("should throw error with non-function as first argument", () => {
    expect(currify).to.throw(/.*/);
    expect(currify.bind(null, "a string")).to.throw(/.*/);
    expect(currify.bind(null, "a string", incBy10)).to.throw(/.*/);
  });

  it("currified function should evaluate results "
     + "if non-function is passed as first argument", () => {
    const add = (a, b = -1, c = -3) => a + b + c;
    const addC = currify(add);

    addC(10, 11, 12).should.equal(add(10, 11, 12));
    addC(10).should.equal(add(10));
  });

  it("currified function should return a function "
     + "if function is passed as first argument", () => {
    const inc10C = currify(incBy10);

    inc10C(() => {}).should.be.a("function");
  });

  it("currified function should be composable "
     + "with non-currified functions", () => {
    const tripleC = currify(triple);
    const inc10ThenTriple = tripleC(incBy10);

    inc10ThenTriple.should.be.a("function");
    inc10ThenTriple(testData).should.deep.equal(testData
      .map(e =>
        (e + 10) * 3
      )
    );
  });

  it("currified function composed with non-currified functions "
     + "cannot be further composed", () => {
    const tripleC = currify(triple);
    const inc10ThenTriple = tripleC(incBy10);

    expect(inc10ThenTriple.bind(null, incBy10)).to.throw(/.*/);
  });

  it("currified functions can infinitely compose", () => {
    const tripleC = currify(triple);
    const inc10C = currify(incBy10);

    let temp = inc10C;
    for (let i = 0; i < 9; ++i)
      temp = inc10C(temp);

    const inc100Triple = tripleC(temp);

    inc100Triple.should.be.a("function");
    inc100Triple(testData).should.deep.equal(
      testData.map(e => (e + 10 * 10) * 3)
    );
  });

  it("works with map, reduce and filter", () => {
    const data = [
      { name: "adam", type: "common name" },
      { name: "comraq", type: "username" },
      { name: "yin", type: "last name" },
      { name: "yi ran", type: "first name" }
    ];

    // Map Functions
    const capNames = e =>
      Object.assign({}, e, { name: e.name.toUpperCase() });

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

    const getFullCapsName = reduce(fullName)(filter(legalName))(map(capNames));
    const getFullName = compose(
      reduce(fullName),
      filter(legalName),
      map(capFirst)
    );
    const getFrequentName = pipe(
      map(capFirst),
      filter(realName),
      filter(oneWord),
      reduce(fullName)
    );

    getFullCapsName(data).should.equal("YIN YI RAN");
    getFullName(data).should.equal("Yin Yi Ran");
    getFrequentName(data).should.equal("Adam Yin");
  });
};
