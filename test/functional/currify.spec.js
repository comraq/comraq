import currify from "../../src/functional/currify";

export default () => {
  it("should return a function", () => {
    const result = currify(() => {});
    result.should.be.a("function");
  });

  it("should throw error with non-function as first argument", () => {
    expect(currify).to.throw(/.*/);
    expect(currify.bind(null, "a string")).to.throw(/.*/);
    expect(currify.bind(null, "a string", () => {})).to.throw(/.*/);
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
    const add = () => {};
    const addCurrified = currify(add);

    addCurrified(() => {}).should.be.a("function");
  });

  it("currified function should be composable "
     + "with non-currified functions", () => {
    function incBy10(numbers) {
      return numbers.map(arg => arg + 10);
    }

    function triple(numbers) {
      return numbers.map(arg => arg * 3);
    }

    const testData = [ 1, 2, 3 ];
    const tripleCurrified = currify(triple);

    const inc10ThenTriple = tripleCurrified(incBy10);
    inc10ThenTriple.should.be.a("function");
    inc10ThenTriple(testData).should.deep.equal(
      testData.map(e => (e + 10) * 3)
    );
  });
};

