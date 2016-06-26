import { currify, placeholder } from "./../functional/curry";

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
const is = (target, type) =>
  Object.prototype.toString.call(target) === `[object ${type}]`;

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
export const isFunction = target => is(target, "Function");

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
export const isArray = target => is(target, "Array");

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
export const isString = target => is(target, "String");

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
export const isNumber = target => is(target, "Number");

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
export const isDate = target => is(target, "Date");

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
export const isJson = target => is(target, "JSON");

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
export const isNull = target => is(target, "Null");

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
export const isUndefined = target => is(target, "Undefined");

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
export const isBoolean = target => is(target, "Boolean");

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
export const isObject = target => is(target, "Object");

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
export const isMap = target => is(target, "Map");

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
export const isIterable = target => isFunction(target[Symbol.iterator]);

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
 */
export const isInstance = currify(
  (target, instance) => target[Symbol.hasInstance](instance),
  2,
  false,
  placeholder
);
