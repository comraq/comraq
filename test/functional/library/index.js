import currySpecs             from "./curry.spec";
import composableSpecs        from "./composable.spec";
import compositionSpecs       from "./composition.spec";
import propSpecs              from "./prop.spec";
import aritySpecs             from "./arity.spec";
import concatSpecs            from "./concat.spec";

export default () => {
  describe("curry:",          currySpecs);
  describe("composable:",     composableSpecs);
  describe("composition:",    compositionSpecs);
  describe("prop:",           propSpecs);
  describe("arity:",          aritySpecs);
  describe("concat:",         concatSpecs);
};
