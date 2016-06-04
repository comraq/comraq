import currify from "../../src/functional/currify";

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
    const addCurrified = currify(add);

    addCurrified(10, 11, 12).should.equal(add(10, 11, 12));
    addCurrified(10).should.equal(add(10));
  });

  it("currified function should return a function "
     + "if function is passed as first argument", () => {
    const inc10Currified = currify(incBy10);

    inc10Currified(() => {}).should.be.a("function");
  });

  it("currified function should be composable "
     + "with non-currified functions", () => {
    const tripleCurrified = currify(triple);

    const inc10ThenTriple = tripleCurrified(incBy10);
    inc10ThenTriple.should.be.a("function");
    inc10ThenTriple(testData).should.deep.equal(
      testData.map(e => (e + 10) * 3)
    );
  });

  it("currified function composed with non-currified functions "
     + "cannot be further composed", () => {
    const tripleCurrified = currify(triple);
    const inc10ThenTriple = tripleCurrified(incBy10);
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

/*
    const capNames = currify(map)(e => {
      console.log(e);

      return Object.assign({}, e, { name: e.name.toUpperCase() });
    });

    const legalName = currify(filter)(e =>
      e.type === "first name" || e.type === "last name"
    );

    const fullName = currify(reduce)((curr, next) =>
      curr + ((curr === "")? next: ` ${next}`),
      ""
    );

    const data = [
      { name: "adam", type: "common name" },
      { name: "comraq", type: "username" },
      { name: "yin", type: "last name" },
      { name: "yi ran", type: "first name" }
    ];

    fullName(legalName(capNames(data)))
      .should.strictEqual("yin yi ran");
*/
    assert.fail(true, false, "map, reduce and filter not yet implemented");
  });
};
