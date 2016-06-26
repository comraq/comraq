"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils");

var utils = _interopRequireWildcard(_utils);

var _functional = require("./functional");

var functional = _interopRequireWildcard(_functional);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var comraq = { utils: utils, functional: functional };

// Export entire library as comraq under the window object if loaded as
// script in browser
if (typeof window !== "undefined") window.comraq = comraq;

exports.default = comraq;

// For commonjs node modules as
// ecma2015 'export default' === 'module.exports.default'
//
// Hence need module.exports = exports.default

module.exports = exports["default"];