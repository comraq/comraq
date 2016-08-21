import currySpecs             from "./curry.spec";
import ArrowSpecs             from "./Arrow.spec";
import compositionSpecs       from "./composition.spec";
import propSpecs              from "./prop.spec";
import aritySpecs             from "./arity.spec";
import concatSpecs            from "./concat.spec";
import emptySpecs             from "./empty.spec";
import flipSpecs              from "./flip.spec";

export default () => {
  describe("curry:",          currySpecs);
  describe("Arrow:",          ArrowSpecs);
  describe("composition:",    compositionSpecs);
  describe("prop:",           propSpecs);
  describe("arity:",          aritySpecs);
  describe("concat:",         concatSpecs);
  describe("empty:",          emptySpecs);
  describe("flip:",           flipSpecs);
};
