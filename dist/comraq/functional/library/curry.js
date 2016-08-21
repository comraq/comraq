"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.partial = exports.curriedApply = exports.getArity = exports.isCurried = exports.placeholder = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = curry;

var _types = require("./../../utils/types");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @public @var {Symbol} placeholder
 * - a placeholder symbol for filling in gaps when currying with curry
 *
 * @see @public @function curry
 */
var placeholder = exports.placeholder = Symbol.for("comraq/curry/placeholder");

/**
 * @public @var {Symbol} aritySymbol
 * - a symbol keeping track of the arity of a curried function
 *
 * @see @public @function curry
 */
var aritySymbol = Symbol.for("comraq/curry/curryArity");

/**
 * @public @function isCurried
 * - checks whether a function is a curried function
 *
 * @param {Function} f
 * - the function to check
 *
 * @return {Boolean}
 * - true if the function is curried
 *   (ie: marked as curried by the 'curry' function)
 * - false otherwise
 *
 * @see @public @function curry
 */
var isCurried = exports.isCurried = function isCurried(f) {
  return _typeof(f[aritySymbol]) === _types.pNumber;
};

/**
 * @public @function getArity
 * - gets the curried arity of a function
 *
 * @param {Function} f
 * - the function to get the arity for
 *
 * @return {Number}
 * - (-1) if the function is not marked as curried by 'curry'
 * - the natural number arity of the curried function otherwise
 *
 * @see @public @function curry
 */
var getArity = exports.getArity = function getArity(f) {
  var result = f[aritySymbol];
  if ((typeof result === "undefined" ? "undefined" : _typeof(result)) === _types.pNumber) return result;

  return -1;
};

/**
 * @public @function curriedApply
 * - applies arguments to a function
 * - if the function is marked as 'curried', it will only apply the number of
 *   arguments equal to the curried arity of the function
 * - otherwise, calls the non-curried function with all arguments
 * - as long as arguments remain and func returns another function,
 *   the function will be continuously applied with the curried number of
 *   arguments (all args if non-curried) until either:
 *   - arguments run out
 *   - returned result is not a function
 *
 * @param {Function} func
 * - the function to apply
 *
 * @param {Any, variadic} args
 * - any number of arguments to call the function with
 *
 * @returns {Any}
 * - if all arguments are consumed by func, the return value of func is returned
 * - otherwise, repeatedly apply func and its result func with arguments
 *   equal to the curried arity of the result func
 *
 * @throws TypeError
 * - if func is not a function
 */
var curriedApply = exports.curriedApply = function curriedApply(func) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if ((typeof func === "undefined" ? "undefined" : _typeof(func)) !== _types.pFunction) throw new TypeError("First argument of curriedApply must be a function!");

  var arity = func[aritySymbol];
  if ((typeof arity === "undefined" ? "undefined" : _typeof(arity)) !== _types.pNumber) return func.apply(undefined, args);else if (args.length <= arity) return func.apply(undefined, args);

  var result = func;
  while ((typeof result === "undefined" ? "undefined" : _typeof(result)) === _types.pFunction && args.length !== 0) {
    arity = _typeof(result[aritySymbol]) === _types.pNumber ? result[aritySymbol] : args.length;

    result = result.apply(undefined, _toConsumableArray(args.splice(0, arity)));
  }
  return result;
};

/**
 * @private @function _markCurried
 * - marks a function as curried by setting the 'aritySymbol'
 *   property to have the curried function arity value
 *
 * @param {Number} n
 * - the curried function arity to set
 *
 * @param {Function} f
 * - the function to mark as 'curried'
 *
 * @return {Function}
 * - the marked function f, with an 'aritySymbol' property
 *   containing the curried arity number
 *
 * @see @private @var {Symbol} aritySymbol
 */
var _markCurried = function _markCurried(n, f) {
  return f[aritySymbol] = n, f;
};

/**
 * @public @function partial
 * - partially applies a function with any number of arguments
 *
 * @param {Function} func
 * - the function to partially apply
 *
 * @param {Any, variadic} ...args
 * - any number of arguments
 *
 * @returns {Function}
 * - the partially function
 *
 * @throws TypeError
 * - non-function passed as first argument
 */
var partial = exports.partial = function partial(func) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  if ((typeof func === "undefined" ? "undefined" : _typeof(func)) !== _types.pFunction) throw new TypeError("First argument '" + func + "' of partial is not a function!");

  return func.bind.apply(func, [undefined].concat(args));
};

/**
 * @public @function curry
 * - auto curries a function
 * - curried function are marked with 'aritySymbol', indicating the arity of
 *   the returned 'curried' function
 *
 * @param {Function} func
 * - the function to be auto-curried
 *
 * @param {Number} fnLen (optional)
 * - the expected number of arguments of func, as variadic functions or
 *   those with default parameters will not have a useful length property,
 *   pass in fnLen to specify a custom function.length if preferred
 *
 * @param {Any} placeholder (optional)
 * - optional dummy value that can be used as placeholders when partially
 *   applying parameters in the middle of the function declaration
 * - if omitted, all future arguments will be accepted as legitimate/valid
 *   arguments to be passed to the curried function
 * - @example:
 *     const pl = "some placeholder value";
 *     let init = curry((...args) => args, 5, false, pl);
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
 *     NOTE: const sparse = func(pl, pl, pl, pl, pl, pl, "g")
 *       |
 *       +-> // many === func( ___, ___, ___, ___, ___, ___, "g")
 *       |
 *       +-> sparse("a", "b", "c", pl, "e")
 *           |
 *           +-> // func( "a", "b", "c", ___, "e", ___, "g")
 *           |
 *           +-> not yet evaluated, still a function!
 *
 * @return {Function}
 * - a curried function that will curry all arguments for func
 *   if not enough parameters are passed in
 *
 * @throws Error
 * - non-function passed as first argument
 */
function curry(func) {
  var fnLen = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];
  var placeholder = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

  if ((typeof func === "undefined" ? "undefined" : _typeof(func)) !== _types.pFunction) throw new Error("Argument \"" + func + "\" of curry is not a function!");

  if (fnLen <= 0) fnLen = func.length;

  if (fnLen === 0) return _markCurried(0, function () {
    return func.apply(undefined, arguments);
  });

  if (arguments.length < 3) return _curry(func, fnLen);

  return _curryPlaceholder(func, fnLen, placeholder, Array(fnLen).fill(placeholder));
}

/**
 * @private @function _curry
 * - curry's internal helper recursive method
 *
 * @see @public @function curry
 */
var _curry = function _curry(func, fnLen) {
  for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  if (fnLen <= 0) return func.apply(undefined, args);

  return _markCurried(fnLen, function () {
    for (var _len4 = arguments.length, newArgs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      newArgs[_key4] = arguments[_key4];
    }

    if (newArgs.length === 0) throw new Error("Curried funtions must be called with at least 1 argument!");

    return _curry.apply(undefined, [func, fnLen - newArgs.length].concat(args, newArgs));
  });
};

/**
 * @private @function _curryPlaceholder
 * - curry's internal helper method if placeholder is used
 *
 * @see @public @function curry
 * @see @public @function curry @param {Any} placeholder
 */
var _curryPlaceholder = function _curryPlaceholder(func, fnLen, placeholder, args) {
  var arityRemain = fnLen - _countExcludeMatchInRange(placeholder, args, 0, fnLen);

  if (arityRemain <= 0) return func.apply(undefined, _toConsumableArray(args));

  return _markCurried(arityRemain, function () {
    for (var _len5 = arguments.length, newArgs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      newArgs[_key5] = arguments[_key5];
    }

    return _curryPlaceholder(func, fnLen, placeholder, _replacePlaceholders(placeholder, newArgs, args.slice()));
  });
};

/**
 * @private @function _replacePlaceholders
 * - _curryPlaceholder's helper method to replace any placeholders from
 *   the currently collected arguments with new arguments
 *
 * @see @private @function _curryPlaceholder
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

      if (e !== match) baseArray[pos] = e;else if (pos === baseArray.length) baseArray[pos] = match;
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
 * @private @function _countExcludeMatchInRange
 * - counts the number of strictly equal elements in array of a given range
 *   that does not match a target
 * - helper function used by _curryPlaceholder
 *
 * @see @private @function _curryPlaceholder
 *
 * @param {Any} match
 * - the match to exclude from the resulting count
 *
 * @param {Array} array
 * - the source array to count from
 *
 * @param {Number} start (optional)
 * - the start index of the array
 *
 * @param {Number} end (optional)
 * - the end index of the array
 *
 * @return {Number}
 * - the number of occurences of elements in array that does not equal match
 */
var _countExcludeMatchInRange = function _countExcludeMatchInRange(match, array) {
  var start = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  var end = arguments.length <= 3 || arguments[3] === undefined ? array.length : arguments[3];

  var result = 0;
  var e = void 0;

  end = end > array.length ? array.length : end;

  while (start < end) {
    e = array[start++];
    result += e !== match ? 1 : 0;
  }

  return result;
};