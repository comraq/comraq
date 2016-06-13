export { default as map } from "./map";
export { default as filter } from "./filter";
export { default as reverse } from "./reverse";

export {
  default as reduce,
  reduceRight,
  reduce1,
  reduceRight1
} from "./reduce";

export { default as head } from "./head";
export { default as tail } from "./tail";
export { default as init } from "./init";
export { default as last } from "./last";
export { default as slice } from "./slice";
export { default as take, takeWhile } from "./take";
//TODO: every/all, some

Array.prototype.empty = () => [];
Array.prototype.concatMutable = function(next) {
  this.push(next);
  return this;
};
