"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _library = require("./../library");

var _map = require("./map");

var _map2 = _interopRequireDefault(_map);

var _cat = require("./cat");

var _cat2 = _interopRequireDefault(_cat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _library.currify)(function (func, target) {
  return (0, _map2.default)(func, (0, _cat2.default)(target));
}, 2, false, _library.placeholder);