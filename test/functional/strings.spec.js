import comraq from "./../../src";

const {
  length, repeat, replace, split,
  upper, lower, trim
} = comraq.functional.strings;

export default () => {
  const s1 = "aSdf";
  const s2 = "1234";
  const s3 = "my name is: yi ran";
  const s4 = "  hello world "; 

  describe("length:", () => {
    it("should return the length of strings", () => {
      length(s1).should.equal(s1.length);
    });
  });

  describe("repeat:", () => {
    it("should repeat a string by a set number of times", () => {
      repeat(5)(s1).should.equal(s1.repeat(5));
    });
  });

  describe("replace:", () => {
    it("should replace a substring by a new string "
       + "given regex or substring", () => {

      replace("yi ran", "adam")(s3).should.equal(
        "my name is: adam"
      );

      replace(/[0-9]+/g, "something")(s2).should.equal(
        "something"
      );
    });
  });

  describe("split:", () => {
    it("should split a string by a separator into an array", () => {
      const splitEach = split("");
      const splitWords = split(" ");

      splitEach(s1).should.be.a("array");
      splitEach(s2).should.have.length(4);

      splitWords(s3).should.have.length(5);
      splitWords(s3).should.deep.equal([
        "my", "name", "is:", "yi", "ran"
      ]);
    });
  });

  describe("lower:", () => {
    it("should convert all characters to lowercase", () => {
      lower(s1).should.equal("asdf");
      lower(s2).should.equal(s2);
    });
  });

  describe("upper:", () => {
    it("should convert all characters to uppercase", () => {
      upper(s1).should.equal("ASDF");
      upper(s2).should.equal(s2);
    });
  });

  describe("trim:", () => {
    it("should trim all whitespaces at the beginning and end of string", () => {
      trim(s4).should.equal("hello world");
    });
  });
};
