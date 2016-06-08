import * as S from "./../../src/functional/strings";

export default () => {
  const s1 = "aSdf";
  const s2 = "1234";
  const s3 = "my name is: yi ran";
  const s4 = "  hello world "; 

  describe("length:", () => {
    it("should return the length of strings", () => {
      S.length(s1).should.equal(s1.length);
    });
  });

  describe("repeat:", () => {
    it("should repeat a string by a set number of times", () => {
      S.repeat(5)(s1).should.equal(s1.repeat(5));
    });
  });

  describe("replace:", () => {
    it("should replace a substring by a new string "
       + "given regex or substring", () => {

      S.replace("yi ran", "adam")(s3).should.equal(
        "my name is: adam"
      );

      S.replace(/[0-9]+/g, "something")(s2).should.equal(
        "something"
      );
    });
  });

  describe("split:", () => {
    it("should split a string by a separator into an array", () => {
      const splitEach = S.split("");
      const splitWords = S.split(" ");

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
      S.lower(s1).should.equal("asdf");
      S.lower(s2).should.equal(s2);
    });
  });

  describe("upper:", () => {
    it("should convert all characters to uppercase", () => {
      S.upper(s1).should.equal("ASDF");
      S.upper(s2).should.equal(s2);
    });
  });

  describe("trim:", () => {
    it("should trim all whitespaces at the beginning and end of string", () => {
      S.trim(s4).should.equal("hello world");
    });
  });
};
