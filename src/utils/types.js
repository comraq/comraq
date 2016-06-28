/**
 * @public @const
 * - string constants for type checking when called with
 *   Object.prototype.toString.call(target)
 *
 * @see @public @function toString
 */
export const sString              = "[object String]";
export const sNumber              = "[object Number]";
export const sArray               = "[object Array]";
export const sObject              = "[object Object]";
export const sFunction            = "[object Function]";
export const sNull                = "[object Null]";
export const sUndefined           = "[object Undefined]";
export const sBoolean             = "[object Boolean]";
export const sDate                = "[object Date]";
export const sJson                = "[object JSON]";
export const sMap                 = "[object Map]";
export const sSet                 = "[object Set]";
export const sGeneratorObject     = "[object Generator]";
export const sGeneratorFunction   = "[object GeneratorFunction]";

/**
 * @public @function toString
 * - an precise way to identitfy the specific type of an instance target
 *
 * @link http://tobyho.com/2011/01/28/checking-types-in-javascript/
 */
export const toString = target => Object.prototype.toString.call(target);

/**
 * @public @const
 * - primitive types to match when using 'typeof'
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
 */
export const pString               = "string";
export const pUndefined            = "undefined";
export const pObject               = "object";
export const pBoolean              = "boolean";
export const pNumber               = "number";
export const pSymbol               = "symbol";
export const pFunction             = "function";
