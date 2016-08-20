import librarySpecs           from "./library";
import arraysSpecs            from "./arrays.spec";
import stringsSpecs           from "./strings.spec";
import categoriesSpecs        from "./categories.spec";
import transducersSpecs       from "./transducers";
import iterablesSpecs         from "./iterables.spec";

export default () => {
  describe("library:",        librarySpecs);
  describe("arrays:",         arraysSpecs);
  describe("strings:",        stringsSpecs);
  describe("iterables:",      iterablesSpecs);
  describe("categories",      categoriesSpecs);
  describe("transducers:",    transducersSpecs);
};
