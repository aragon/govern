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

function IconAlignJustify(_ref) {
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
    d: "M20.273 9.434H3.727a.727.727 0 000 1.455h16.546a.727.727 0 000-1.455zm0-3.676H3.727a.727.727 0 000 1.454h16.546a.727.727 0 100-1.454zm0 7.353H3.727a.727.727 0 100 1.454h16.546a.727.727 0 100-1.454zm0 3.677H3.727a.727.727 0 100 1.454h16.546a.727.727 0 100-1.454z"
  }));
}

IconAlignJustify.propTypes = IconPropTypes.IconPropTypes;

exports.default = IconAlignJustify;
//# sourceMappingURL=IconAlignJustify.js.map
