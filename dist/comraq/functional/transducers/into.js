"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _curry = require("./../curry");

var _concat = require("./concat");

var _transduce = require("./transduce");

var _transduce2 = _interopRequireDefault(_transduce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _curry.currify)(function (acc, transducer, coll) {
  return (0, _transduce2.default)(transducer, _concat.concatMutable, acc, coll);
}, 3, false, _curry.placeholder);