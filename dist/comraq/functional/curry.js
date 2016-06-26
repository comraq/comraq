"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.autoCurry = exports.currify = exports.placeholder = undefined;

var _checks = require("../utils/checks");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @public @var {Symbol} placeholder
 * - a placeholder symbol for filling in gaps when currying with currify
 *
 * @see @public @function currify
 */
var placeholder = exports.placeholder = Symbol.for("comraq/curry/placeholder");

/**
 * @public @function curry
 * - curries a function with any number of arguments
 *
 * @param {Function} func
 * - the function to curry
 *
 * @param {Any, variadic} ...args
 * - any number of arguments
 *
 * @returns {Function}
 * - the curried function
 *
 * @throws Error
 * - non-function passed as first argument
 */
var curry = function curry(func) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (!(0, _checks.isFunction)(func)) throw new Error("First argument '" + func + "' of curry is not a function!");

  return func.bind.apply(func, [undefined].concat(args));
};

exports.default = curry;

/**
 * @public @function currify
 * - auto curries a function
 *
 * @param {Function} func
 * - the function to be auto-curried
 *
 * @param {Number} fnLen (optional)
 * - the expected number of arguments of func, as variadic functions or
 *   those with default parameters will not have a useful length property,
 *   pass in fnLen to specify a custom function.length if preferred
 *
 * @param {Boolean} right (optional)
 * - the direction of curried arguments
 * - if right === true:
 *     - args will be curried from right to left for func
 * - otherwise:
 *     - args will be curried from left to right for func
 *
 * @param {Any} placeholder (optional)
 * - optional dummy value that can be used as placeholders when partially
 *   applying parameters in the middle of the function declaration
 * - if omitted, all future arguments will be accepted as legitimate/valid
 *   arguments to be passed to the curried function
 * - @example:
 *     const pl = "some placeholder value";
 *     let init = currify((...args) => args, 5, false, pl);
 *     let func;
 *
 *     func = init(pl, pl, pl, pl, "e"); // func( ___, ___, ___, ___, "e")
 *
 *     func = func(pl, "b", pl);         // func( ___, "b", ___, ___, "e")
 *
 *     func = func("a");                 // func( "a", "b", ___, ___, "e")
 *
 *     const result = func("c", "d");    // func( "a", "b", "c", "d", "e")
 *       |
 *       +-> function finally gets called, result = [ "a", "b", "c", "d", "e" ]
 *
 *
 *     NOTE: func("c", "d", "f") ------> // func( "a", "b", "c", "d", "e", "f")
 *       |
 *       +-> function gets called with all excess arguments
 *
 *     NOTE: const many = func(pl, pl, pl, pl, pl, pl, "g") 
 *       |
 *       +-> // many === func( ___, ___, ___, ___, ___, "g")
 *       |
 *       +-> many("a", "b", "c", pl, "e")
 *           |
 *           +-> // func( "a", "b", "c", ___, "e", "g")
 *           |
 *           +-> not yet evaluated, still a function!
 *
 * @return {Function}
 * - a curried function that will currify all arguments for func
 *   if not enough parameters are passed in
 *
 * @throws Error
 * - non-function passed as first argument
 */

var currify = exports.currify = function currify(func) {
  var fnLen = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];
  var right = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
  var placeholder = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];

  if (!(0, _checks.isFunction)(func)) throw new Error("Argument \"" + func + "\" of currify is not a function!");

  if (fnLen <= 0) fnLen = func.length;

  if (arguments.length < 4) return _currify(func, fnLen, right);

  return _currifyPlaceholder(func, fnLen, right, placeholder, Array(fnLen).fill(placeholder));
};

/**
 * @private @function _currify
 * - currify's internal helper recursive method
 *
 * @see @public @function currify
 */
var _currify = function _currify(func, fnLen, right) {
  for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    args[_key2 - 3] = arguments[_key2];
  }

  if (fnLen <= args.length) return func.apply(undefined, _toConsumableArray(right ? args.reverse() : args));

  return function () {
    for (var _len3 = arguments.length, newArgs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      newArgs[_key3] = arguments[_key3];
    }

    return _currify.apply(undefined, [func, fnLen, right].concat(args, newArgs));
  };
};

/**
 * @private @function _currifyPlaceholder
 * - currify's internal helper method if placeholder is used
 *
 * @see @public @function currify
 * @see @public @function currify @param {Any} placeholder
 */
var _currifyPlaceholder = function _currifyPlaceholder(func, fnLen, right, placeholder, args) {
  var pos = args.indexOf(placeholder);
  if (pos === -1 || pos >= fnLen) return func.apply(undefined, _toConsumableArray(right ? args.reverse() : args));

  return function () {
    for (var _len4 = arguments.length, newArgs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      newArgs[_key4] = arguments[_key4];
    }

    return _currifyPlaceholder(func, fnLen, right, placeholder, _replacePlaceholders(placeholder, newArgs, args.slice()));
  };
};

/**
 * @private @function _replacePlaceholders
 * - _currifyPlaceholder's helper method to replace any placeholders from
 *   the currently collected arguments with new arguments
 *
 * @see @private @function _currifyPlaceholder
 *
 * @param {Any} match
 * - the target placeholder/dummy value to match
 *
 * @param {Array} newArray
 * - the array of new arguments
 *
 * @param {Array} baseArray
 * - the array of currently existing arguments
 *
 * @return {Array}
 * - the baseArray with placeholders replaced from valid elements in the
 *   newArray
 */
var _replacePlaceholders = function _replacePlaceholders(match, newArray, baseArray) {
  var pos = -1;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = newArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var e = _step.value;

      pos = baseArray.indexOf(match, ++pos);

      pos = pos === -1 ? baseArray.length : pos;

      if (e !== match) baseArray[pos] = e;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return baseArray;
};

/**
 * @public @function autoCurry
 * - same as currify for functions that returns non-functions as return value
 * - if func's execution returns another function autoCurry is re-applied
 *
 * @see @public @function currify
 * @see @private @function _autoCurry
 *
 * @example
 *   const addFiveVals = autoCurry(a => b => c => d => e => a + b + c + d + e);
 *
 *   addFiveVals.should.be.a("function");
 *   addFiveVals(1)(2).should.be.a("function");
 *   addFiveVals(1, 2).should.be.a("function");
 *   addFiveVals(1, 2, 3, 4, 5).should.equal(15);
 *   addFiveVals(1)(2)(3)(4)(5).should.equal(15);
 *   addFiveVals(1, 2)(3, 4)(5).should.equal(15);
 */
var autoCurry = exports.autoCurry = function autoCurry(func) {
  var fnLen = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  if (!(0, _checks.isFunction)(func)) throw new Error("Argument '" + func + "' of currify is not a function!");

  if (fnLen <= 0) fnLen = func.length;

  return _autoCurry(func, fnLen);
};

/**
 * @private @function _autoCurry
 * - recursive helper function for autoCurry
 *
 * @param {Function} func
 * - the function to be curried
 *
 * @param {Number} fnLen
 * - the remaining number of arguments (function arity) for func
 *
 * @param {Any, variadic} ...args
 * - the arbitrary number of arguments to be bound to func
 *
 * @returns {Any|Function}
 * - the result if func returns non-function
 * - result of autoCurry wrapping the returned function
 *
 * @see @public @function autoCurry
 */
var _autoCurry = function _autoCurry(func, fnLen) {
  for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
    args[_key5 - 2] = arguments[_key5];
  }

  var argsToBind = args.splice(0, fnLen);

  // Got less arguments than necessary for current function execution,
  // build up accumulated arguments with bind
  if (fnLen > argsToBind.length) return function () {
    for (var _len6 = arguments.length, newArgs = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      newArgs[_key6] = arguments[_key6];
    }

    return _autoCurry.apply(undefined, [func.bind.apply(func, [undefined].concat(_toConsumableArray(argsToBind))), fnLen - argsToBind.length].concat(newArgs));
  };

  // Got enough arguments, execute function and check if
  // result is another function, if so, recurse, otherwise return result
  var result = func.apply(undefined, _toConsumableArray(argsToBind));
  if (!(0, _checks.isFunction)(result)) return result;

  return _autoCurry.call.apply(_autoCurry, [undefined, result, result.length].concat(args));
};