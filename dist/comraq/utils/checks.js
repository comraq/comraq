"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInstance = exports.isPrimitive = exports.isIterable = exports.isGeneratorFunction = exports.isGeneratorObject = exports.isSet = exports.isMap = exports.isObject = exports.isBoolean = exports.isUndefined = exports.isNull = exports.isJson = exports.isDate = exports.isNumber = exports.isString = exports.isArray = exports.isFunction = undefined;

var _curry = require("./../functional/library/curry");

/**
 * @private @function is
 * - checking whether target is of type
 *
 * @param {Any} target
 * - the target to check
 *
 * @param {String} type
 * - the string of the type
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var is = function is(target, type) {
  return Object.prototype.toString.call(target) === "[object " + type + "]";
};

/**
 * @public @function isFunction
 * - checks for whether target is of type Function
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isFunction = exports.isFunction = function isFunction(target) {
  return is(target, "Function");
};

/**
 * @public @function isArray
 * - checks for whether target is of type Array
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isArray = exports.isArray = function isArray(target) {
  return is(target, "Array");
};

/**
 * @public @function isString
 * - checks for whether target is of type String
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isString = exports.isString = function isString(target) {
  return is(target, "String");
};

/**
 * @public @function isNumber
 * - checks for whether target is of type Number
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isNumber = exports.isNumber = function isNumber(target) {
  return is(target, "Number");
};

/**
 * @public @function isDate
 * - checks for whether target is of type Date
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isDate = exports.isDate = function isDate(target) {
  return is(target, "Date");
};

/**
 * @public @function isJSON
 * - checks for whether target is of type JSON
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isJson = exports.isJson = function isJson(target) {
  return is(target, "JSON");
};

/**
 * @public @function isNull
 * - checks for whether target is of type Null
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isNull = exports.isNull = function isNull(target) {
  return is(target, "Null");
};

/**
 * @public @function isUndefined
 * - checks for whether target is of type Undefined
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isUndefined = exports.isUndefined = function isUndefined(target) {
  return is(target, "Undefined");
};

/**
 * @public @function isBoolean
 * - checks for whether target is of type Boolean
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isBoolean = exports.isBoolean = function isBoolean(target) {
  return is(target, "Boolean");
};

/**
 * @public @function isObject
 * - checks for whether target is of type Object
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isObject = exports.isObject = function isObject(target) {
  return is(target, "Object");
};

/**
 * @public @function isMap
 * - checks for whether target is of type Map
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isMap = exports.isMap = function isMap(target) {
  return is(target, "Map");
};

/**
 * @public @function isSet
 * - checks for whether target is of type Set
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isSet = exports.isSet = function isSet(target) {
  return is(target, "Set");
};

/**
 * @public @function isGeneratorObject
 * - checks for whether target is of type GeneratorObject
 * - ie: the object returned by a generator function
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isGeneratorObject = exports.isGeneratorObject = function isGeneratorObject(target) {
  return is(target, "Generator");
};

/**
 * @public @function isGeneratorFunction
 * - checks for whether target is of type GeneratorFunction
 * - ie: functions declared with -> function* () {}
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is of type, false otherwise
 */
var isGeneratorFunction = exports.isGeneratorFunction = function isGeneratorFunction(target) {
  return is(target, "GeneratorFunction");
};

/**
 * @public @function isIterable
 * - checks for whether target is implements the Iterable interface
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target implements the Iterable interface, false otherwise
 */
var isIterable = exports.isIterable = function isIterable(target) {
  return isFunction(target[Symbol.iterator]);
};

/**
 * @public @function isPrimitive
 * - tests whether a value is primitive
 *
 * @param {Any} target
 * - the target to test
 *
 * @returns {Boolean}
 * - true if target is a primitve value, false otherwise
 *
 * @example
 * - isPrimitive(123)        // false
 * - isPrimitive("asdf")     // true
 * - isPrimitive({})         // true
 * - isPrimitive(Array)      // true
 * - isPrimitive(null)       // false
 * - isPrimitive(undefined)  // false
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf
 */
var isPrimitive = exports.isPrimitive = function isPrimitive(target) {
  return !Object.prototype.isPrototypeOf(target);
};

/**
 * @public @function isInstance
 * - checks for whether target is an instance of a
 *   class/interface/prototype/function
 *
 * @param {Class|Interface|Prototype|Function} target
 * - the target class/interface/prototype/function to be checked against
 *
 * @param {Any} instance
 * - the target instance to check
 *
 * @returns {Boolean}
 * - true if instance is an instance of target, false otherwise
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof
 */
var isInstance = exports.isInstance = (0, _curry.currify)(function (target, instance) {
  return target[Symbol.hasInstance](instance);
}, 2, false, _curry.placeholder);