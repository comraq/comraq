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
var tString = exports.tString = "[object String]";
var tNumber = exports.tNumber = "[object Number]";
var tArray = exports.tArray = "[object Array]";
var tObject = exports.tObject = "[object Object]";
var tFunction = exports.tFunction = "[object Function]";
var tNull = exports.tNull = "[object Null]";
var tUndefined = exports.tUndefined = "[object Undefined]";
var tBoolean = exports.tBoolean = "[object Boolean]";
var tDate = exports.tDate = "[object Date]";
var tJson = exports.tJson = "[object JSON]";
var tMap = exports.tMap = "[object Map]";
var tSet = exports.tSet = "[object Set]";
var tGeneratorObject = exports.tGeneratorObject = "[object Generator]";
var tGeneratorFunction = exports.tGeneratorFunction = "[object GeneratorFunction]";

/**
 * @public @function toString
 * - an precise way to identitfy the specific type of an instance target
 *
 * @link http://tobyho.com/2011/01/28/checking-types-in-javascript/
 */
var toString = exports.toString = function toString(target) {
  return Object.prototype.toString.call(target);
};