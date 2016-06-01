import currySpecs from "./functional/curry.spec";
import currifySpecs from "./functional/currify.spec";

describe("functional:", () => {
  describe("curry:", currySpecs);
  describe("currify:", currifySpecs);
});
