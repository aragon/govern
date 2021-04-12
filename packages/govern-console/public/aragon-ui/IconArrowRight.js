'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('./slicedToArray-a8a77f0e.js');
require('./unsupportedIterableToArray-f175acfa.js');
var React = require('react');
require('./_commonjsHelpers-1b94f6bc.js');
require('./index-46d0e707.js');
require('./miscellaneous.js');
require('./environment.js');
require('./constants.js');
var _extends = require('./extends-023d783e.js');
var objectWithoutProperties = require('./objectWithoutProperties-c6d3675c.js');
require('./index-4def0554.js');
var IconPropTypes = require('./IconPropTypes-12cd7567.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function IconArrowRight(_ref) {
  var size = _ref.size,
      props = objectWithoutProperties.objectWithoutProperties(_ref, ["size"]);

  var sizeValue = IconPropTypes.useIconSize(size);
  return /*#__PURE__*/React__default['default'].createElement("svg", _extends._extends_1({
    width: sizeValue,
    height: sizeValue,
    fill: "none",
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React__default['default'].createElement("path", {
    fill: "currentColor",
    stroke: "currentColor",
    strokeWidth: 0.2,
    d: "M5.566 12.566h12.869a.566.566 0 000-1.132H5.565a.566.566 0 100 1.132z"
  }), /*#__PURE__*/React__default['default'].createElement("path", {
    fill: "currentColor",
    stroke: "currentColor",
    strokeWidth: 0.2,
    d: "M17.634 12l-4.426 4.426a.566.566 0 00.8.8l4.826-4.826a.566.566 0 000-.8l-4.826-4.826a.564.564 0 00-.8 0 .566.566 0 000 .8L17.634 12z"
  }));
}

IconArrowRight.propTypes = IconPropTypes.IconPropTypes;

exports.default = IconArrowRight;
//# sourceMappingURL=IconArrowRight.js.map
