import currySpecs from "./functional/curry.spec";
import composableSpecs from "./functional/composable.spec";
import compositionSpecs from "./functional/composition.spec";
import arraysSpecs from "./functional/arrays.spec";
import propSpecs from "./functional/prop.spec";
import stringsSpecs from "./functional/strings.spec";
import fantasyLandSpecs from "./functional/fantasy-land.spec";
import transducersSpecs from "./functional/transducers.spec";
import iterablesSpecs from "./functional/iterables.spec";

describe("functional:", () => {
  describe("curry:", currySpecs);
  describe("composable:", composableSpecs);
  describe("composition:", compositionSpecs);
  describe("arrays:", arraysSpecs);
  describe("prop:", propSpecs);
  describe("strings:", stringsSpecs);
  describe("fantasy-land:", fantasyLandSpecs);
  describe("transducers:", transducersSpecs);
  describe("iterables:", iterablesSpecs);
});
