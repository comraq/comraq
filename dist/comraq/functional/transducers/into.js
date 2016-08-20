"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _library = require("./../library");

var _arrays = require("./../arrays");

var _transduce = require("./transduce");

var _transduce2 = _interopRequireDefault(_transduce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _library.currify)(function (acc, transducer, coll) {
  return (0, _transduce2.default)(transducer, _arrays.pushMutable, acc, coll);
}, 3, false, _library.placeholder);