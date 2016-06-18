export { default as slice } from "./slice";

/**
 * @implements Monoid
 * - adds the empty and concatMutable methods for arrays
 */
Array.prototype.empty = () => [];
Array.prototype.concatMutable = function(next) {
  this.push(next);
  return this;
};
