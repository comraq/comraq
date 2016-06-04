import currySpecs from "./functional/curry.spec";
import currifySpecs from "./functional/currify.spec";
import mapSpecs from "./functional/map.spec";
import composeSpecs from "./functional/compose.spec";

describe("functional:", () => {
  describe("curry:", currySpecs);
  describe("currify:", currifySpecs);
  describe("map:", mapSpecs);
  describe("compose:", composeSpecs);
});
