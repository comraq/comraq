const is = (target, type) =>
  Object.prototype.toString.call(target) === `[object ${type}]`;

export const isFunction = target => is(target, "Function");

export const isArray = target => is(target, "Array");

export const isString = target => is(target, "String");

export const isNumber = target => is(target, "Number");

export const isDate = target => is(target, "Date");

export const isJson = target => is(target, "JSON");

export const isNull = target => is(target, "Null");

export const isUndefined = target => is(target, "Undefined");

export const isBoolean = target => is(target, "Boolean");
