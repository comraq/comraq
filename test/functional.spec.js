import currySpecs from "./functional/curry.spec";
import currifySpecs from "./functional/currify.spec";
import arraysSpecs from "./functional/arrays.spec";
import compositionSpecs from "./functional/composition.spec";

describe("functional:", () => {
  describe("curry:", currySpecs);
  describe("currify:", currifySpecs);
  describe("composition:", compositionSpecs);
  describe("arrays:", arraysSpecs);
});
