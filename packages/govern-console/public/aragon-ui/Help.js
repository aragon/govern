'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var slicedToArray = require('./slicedToArray-a8a77f0e.js');
require('./unsupportedIterableToArray-f175acfa.js');
var React = require('react');
require('./_commonjsHelpers-1b94f6bc.js');
var index$1 = require('./index-46d0e707.js');
require('./defineProperty-3cad0327.js');
require('./toConsumableArray-cc0d28a9.js');
var _styled = require('styled-components');
require('./getPrototypeOf-55c9e80c.js');
require('./color.js');
require('./components.js');
require('./css.js');
require('./miscellaneous.js');
require('./environment.js');
require('./font.js');
require('./keycodes.js');
var constants = require('./constants.js');
require('./springs.js');
var textStyles = require('./text-styles.js');
require('./theme-dark.js');
require('./theme-light.js');
var Theme = require('./Theme.js');
require('./extends-023d783e.js');
require('./objectWithoutProperties-c6d3675c.js');
var index = require('./index-4def0554.js');
require('./FocusVisible.js');
require('./ButtonBase.js');
require('./IconPropTypes-12cd7567.js');
var IconQuestion = require('./IconQuestion.js');
require('./objectWithoutPropertiesLoose-1af20ad0.js');
require('react-dom');
require('./web-7cbdbd84.js');
require('./Root-8693e46b.js');
require('./RootPortal.js');
require('./proptypes-9c58a90f.js');
var Popover = require('./Popover.js');
var DiscButton = require('./DiscButton.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var _styled__default = /*#__PURE__*/_interopDefaultLegacy(_styled);

var _StyledDiscButton = _styled__default['default'](DiscButton.default).withConfig({
  displayName: "Help___StyledDiscButton",
  componentId: "sc-11d74sh-0"
})(["margin-top:", "px;margin-left:", "px;"], function (p) {
  return p._css;
}, function (p) {
  return p._css2;
});

var _StyledPopover = _styled__default['default'](Popover.default).withConfig({
  displayName: "Help___StyledPopover",
  componentId: "sc-11d74sh-1"
})(["border:0;overflow:hidden;", ";"], function (p) {
  return p._css3;
});

var _StyledDiv = _styled__default['default']("div").withConfig({
  displayName: "Help___StyledDiv",
  componentId: "sc-11d74sh-2"
})(["position:relative;max-width:", "px;min-width:", "px;padding:", "px;&:before{content:'';position:absolute;top:0;left:0;bottom:0;width:", "px;background:", ";}"], function (p) {
  return p._css4;
}, function (p) {
  return p._css5;
}, function (p) {
  return p._css6;
}, function (p) {
  return p._css7;
}, function (p) {
  return p._css8;
});

function Help(_ref) {
  var hint = _ref.hint,
      children = _ref.children;
  var theme = Theme.useTheme();
  var buttonElement = React.useRef();

  var _useState = React.useState(false),
      _useState2 = slicedToArray.slicedToArray(_useState, 2),
      visible = _useState2[0],
      setVisible = _useState2[1];

  var open = React.useCallback(function () {
    return setVisible(true);
  }, []);
  var close = React.useCallback(function () {
    return setVisible(false);
  }, []);

  var _useInside = index.o('Box:heading'),
      _useInside2 = slicedToArray.slicedToArray(_useInside, 1),
      insideBoxHeading = _useInside2[0];

  var _useInside3 = index.o('Field:label'),
      _useInside4 = slicedToArray.slicedToArray(_useInside3, 1),
      insideFieldLabel = _useInside4[0];

  return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement(_StyledDiscButton, {
    ref: buttonElement,
    description: hint,
    onClick: open,
    size: 2 * constants.GU,
    _css: insideFieldLabel ? -3 : 0,
    _css2: insideBoxHeading || insideFieldLabel ? 1 * constants.GU : 0
  }, /*#__PURE__*/React__default['default'].createElement(IconQuestion.default, {
    size: "tiny"
  })), /*#__PURE__*/React__default['default'].createElement(_StyledPopover, {
    opener: buttonElement.current,
    visible: visible,
    onClose: close,
    _css3: textStyles.textStyle('body3')
  }, /*#__PURE__*/React__default['default'].createElement(_StyledDiv, {
    _css4: 48 * constants.GU,
    _css5: 20 * constants.GU,
    _css6: 3 * constants.GU,
    _css7: 0.5 * constants.GU,
    _css8: theme.help
  }, children)));
}

Help.propTypes = {
  hint: index$1.propTypes.string.isRequired,
  children: index$1.propTypes.node.isRequired
};

exports.default = Help;
//# sourceMappingURL=Help.js.map
