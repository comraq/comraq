import arrayFunction from "./array-function";

export const reduceLeft = (...args) =>
  arrayFunction("ReduceLeft", Array.prototype.reduce, ...args);

export const reduceRight = (...args) =>
  arrayFunction("ReduceRight", Array.prototype.reduceRight, ...args);
