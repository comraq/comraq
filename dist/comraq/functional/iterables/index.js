"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduce = require("./reduce");

Object.defineProperty(exports, "reduce", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_reduce).default;
  }
});
Object.defineProperty(exports, "reduceRight", {
  enumerable: true,
  get: function get() {
    return _reduce.reduceRight;
  }
});
Object.defineProperty(exports, "reduce1", {
  enumerable: true,
  get: function get() {
    return _reduce.reduce1;
  }
});
Object.defineProperty(exports, "reduceRight1", {
  enumerable: true,
  get: function get() {
    return _reduce.reduceRight1;
  }
});

var _reverse = require("./reverse");

Object.defineProperty(exports, "reverse", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_reverse).default;
  }
});

var _getIterator = require("./get-iterator");

Object.defineProperty(exports, "getIterator", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_getIterator).default;
  }
});

var _head = require("./head");

Object.defineProperty(exports, "head", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_head).default;
  }
});

var _last = require("./last");

Object.defineProperty(exports, "last", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_last).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }