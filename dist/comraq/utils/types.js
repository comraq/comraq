"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @public @const
 * - string constants for type checking when called with
 *   Object.prototype.toString.call(target)
 *
 * @see @public @function toString
 */
var sString = exports.sString = "[object String]";
var sNumber = exports.sNumber = "[object Number]";
var sArray = exports.sArray = "[object Array]";
var sObject = exports.sObject = "[object Object]";
var sFunction = exports.sFunction = "[object Function]";
var sNull = exports.sNull = "[object Null]";
var sUndefined = exports.sUndefined = "[object Undefined]";
var sBoolean = exports.sBoolean = "[object Boolean]";
var sDate = exports.sDate = "[object Date]";
var sJson = exports.sJson = "[object JSON]";
var sMap = exports.sMap = "[object Map]";
var sSet = exports.sSet = "[object Set]";
var sGeneratorObject = exports.sGeneratorObject = "[object Generator]";
var sGeneratorFunction = exports.sGeneratorFunction = "[object GeneratorFunction]";

/**
 * @public @function toString
 * - an precise way to identitfy the specific type of an instance target
 *
 * @link http://tobyho.com/2011/01/28/checking-types-in-javascript/
 */
var toString = exports.toString = function toString(target) {
  return Object.prototype.toString.call(target);
};

/**
 * @public @const
 * - primitive types to match when using 'typeof'
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
 */
var pString = exports.pString = "string";
var pUndefined = exports.pUndefined = "undefined";
var pObject = exports.pObject = "object";
var pBoolean = exports.pBoolean = "boolean";
var pNumber = exports.pNumber = "number";
var pSymbol = exports.pSymbol = "symbol";
var pFunction = exports.pFunction = "function";