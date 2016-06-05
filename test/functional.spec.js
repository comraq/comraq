import currySpecs from "./functional/curry.spec";
import composableSpecs from "./functional/composable.spec";
import compositionSpecs from "./functional/composition.spec";
import arraysSpecs from "./functional/arrays.spec";
import getPropSpecs from "./functional/getProp.spec";

describe("functional:", () => {
  describe("curry:", currySpecs);
  describe("composable:", composableSpecs);
  describe("composition:", compositionSpecs);
  describe("arrays:", arraysSpecs);
  describe("getProp:", getPropSpecs);
});
