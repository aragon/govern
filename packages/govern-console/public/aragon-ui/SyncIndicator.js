'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('./slicedToArray-a8a77f0e.js');
require('./unsupportedIterableToArray-f175acfa.js');
var React = require('react');
require('./_commonjsHelpers-1b94f6bc.js');
var index = require('./index-46d0e707.js');
require('./defineProperty-3cad0327.js');
require('./toConsumableArray-cc0d28a9.js');
var _styled = require('styled-components');
require('./getPrototypeOf-55c9e80c.js');
require('./color.js');
require('./components.js');
require('./miscellaneous.js');
require('./environment.js');
require('./font.js');
var constants = require('./constants.js');
require('./breakpoints.js');
require('./springs.js');
require('./text-styles.js');
require('./theme-dark.js');
require('./theme-light.js');
require('./Theme.js');
var _extends = require('./extends-023d783e.js');
var objectWithoutProperties = require('./objectWithoutProperties-c6d3675c.js');
require('./index-4def0554.js');
require('./_baseGetTag-42b4dd3e.js');
require('./Viewport-819c53c9.js');
require('./objectWithoutPropertiesLoose-1af20ad0.js');
require('react-dom');
require('./web-7cbdbd84.js');
var LoadingRing = require('./LoadingRing.js');
require('./ToastHub.js');
require('./Root-8693e46b.js');
require('./RootPortal.js');
var FloatIndicator = require('./FloatIndicator.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var _styled__default = /*#__PURE__*/_interopDefaultLegacy(_styled);

var _StyledDiv = _styled__default['default']("div").withConfig({
  displayName: "SyncIndicator___StyledDiv",
  componentId: "sc-19m50aw-0"
})(["margin-left:", "px;"], function (p) {
  return p._css;
});

var _StyledSpan = _styled__default['default']("span").withConfig({
  displayName: "SyncIndicator___StyledSpan",
  componentId: "sc-19m50aw-1"
})(["white-space:nowrap"]);

function SyncIndicator(_ref) {
  var children = _ref.children,
      label = _ref.label,
      shift = _ref.shift,
      visible = _ref.visible,
      props = objectWithoutProperties.objectWithoutProperties(_ref, ["children", "label", "shift", "visible"]);

  return /*#__PURE__*/React__default['default'].createElement(FloatIndicator.default, _extends._extends_1({
    visible: visible,
    shift: shift
  }, props), /*#__PURE__*/React__default['default'].createElement(LoadingRing.default, null), /*#__PURE__*/React__default['default'].createElement(_StyledDiv, {
    _css: 1.5 * constants.GU
  }, children || /*#__PURE__*/React__default['default'].createElement(_StyledSpan, null, label, " \uD83D\uDE4F")));
}

SyncIndicator.propTypes = {
  children: index.propTypes.node,
  label: index.propTypes.node,
  shift: index.propTypes.number,
  visible: index.propTypes.bool
};
SyncIndicator.defaultProps = {
  label: 'Syncing data…'
};

exports.default = SyncIndicator;
//# sourceMappingURL=SyncIndicator.js.map
