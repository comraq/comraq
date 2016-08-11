import currySpecs             from "./functional/curry.spec";
import composableSpecs        from "./functional/composable.spec";
import compositionSpecs       from "./functional/composition.spec";
import arraysSpecs            from "./functional/arrays.spec";
import propSpecs              from "./functional/prop.spec";
import stringsSpecs           from "./functional/strings.spec";
import algebraicSpecs         from "./functional/algebraic.spec";
import transducersSpecs       from "./functional/transducers.spec";
import iterablesSpecs         from "./functional/iterables.spec";
import aritySpecs             from "./functional/arity.spec";

describe("functional:", () => {
  describe("curry:",          currySpecs);
  describe("composable:",     composableSpecs);
  describe("composition:",    compositionSpecs);
  describe("arrays:",         arraysSpecs);
  describe("prop:",           propSpecs);
  describe("strings:",        stringsSpecs);
  describe("iterables:",      iterablesSpecs);
  describe("algebraic",       algebraicSpecs);
  describe("transducers:",    transducersSpecs);
  describe("arity",           aritySpecs);
});
