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
require('./css.js');
require('./miscellaneous.js');
require('./environment.js');
require('./font.js');
require('./keycodes.js');
var constants = require('./constants.js');
var textStyles = require('./text-styles.js');
require('./theme-dark.js');
require('./theme-light.js');
var Theme = require('./Theme.js');
require('./extends-023d783e.js');
var objectWithoutProperties = require('./objectWithoutProperties-c6d3675c.js');
var index = require('./index-4def0554.js');
require('./FocusVisible.js');
var ButtonBase = require('./ButtonBase.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var _styled__default = /*#__PURE__*/_interopDefaultLegacy(_styled);

var _StyledButtonBase = _styled__default['default'](ButtonBase.default).withConfig({
  displayName: "BadgeBase___StyledButtonBase",
  componentId: "sc-4zaahn-0"
})(["display:inline-flex;overflow:hidden;color:", ";height:", "px;background:", ";", ";&:active{", ";}"], function (p) {
  return p._css;
}, function (p) {
  return p._css2;
}, function (p) {
  return p._css3;
}, function (p) {
  return p._css4;
}, function (p) {
  return p._css5;
});

var _StyledDiv = _styled__default['default']("div").withConfig({
  displayName: "BadgeBase___StyledDiv",
  componentId: "sc-4zaahn-1"
})(["overflow:hidden;display:flex;align-items:center;text-decoration:none;", ";"], function (p) {
  return p._css6;
});

var _StyledSpan = _styled__default['default']("span").withConfig({
  displayName: "BadgeBase___StyledSpan",
  componentId: "sc-4zaahn-2"
})(["white-space:nowrap;text-overflow:ellipsis;overflow:hidden;", " ", ""], function (p) {
  return p._css7;
}, function (p) {
  return p._css8;
});

var BadgeBase = /*#__PURE__*/React__default['default'].memo(function BadgeBase(_ref) {
  var badgeRef = _ref.badgeRef,
      children = _ref.children,
      className = _ref.className,
      compact = _ref.compact,
      disabled = _ref.disabled,
      href = _ref.href,
      icon = _ref.icon,
      label = _ref.label,
      labelStyle = _ref.labelStyle,
      onClick = _ref.onClick,
      style = _ref.style,
      title = _ref.title,
      props = objectWithoutProperties.objectWithoutProperties(_ref, ["badgeRef", "children", "className", "compact", "disabled", "href", "icon", "label", "labelStyle", "onClick", "style", "title"]);

  var theme = Theme.useTheme();

  var _useInside = index.o('DropDown'),
      _useInside2 = slicedToArray.slicedToArray(_useInside, 1),
      insideDropDownMenu = _useInside2[0];

  if (insideDropDownMenu) {
    disabled = true;
  }

  return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement(_StyledButtonBase, {
    ref: badgeRef,
    title: title,
    disabled: disabled,
    element: href || disabled ? 'a' : 'button',
    onClick: !disabled ? onClick : undefined,
    href: !disabled ? href : undefined,
    focusRingRadius: constants.RADIUS,
    _css: theme.badgeContent,
    _css2: 3 * constants.GU,
    _css3: compact ? 'transparent' : theme.badge,
    _css4: insideDropDownMenu ? 'cursor: pointer' : '',
    _css5: !disabled && compact ? "background: ".concat(theme.badgePressed) : ''
  }, /*#__PURE__*/React__default['default'].createElement(_StyledDiv, {
    className: className,
    style: style,
    _css6: compact ? "\n                  padding: 0 ".concat(1 * constants.GU, "px;\n                  border-radius: 2px;\n                ") : "\n                  padding-left: ".concat((icon ? 0 : 1.5) * constants.GU, "px;\n                  padding-right: ").concat((icon ? 1 : 1.5) * constants.GU, "px;\n                  border-radius: ").concat(constants.RADIUS, "px;\n                ")
  }, icon, /*#__PURE__*/React__default['default'].createElement(_StyledSpan, {
    _css7: textStyles.textStyle('body2'),
    _css8: labelStyle
  }, label))), typeof children === 'function' ? children(disabled) // whether popover is disabled
  : children);
});
BadgeBase.propTypes = {
  badgeRef: index$1.propTypes.any,
  children: index$1.propTypes.oneOfType([index$1.propTypes.node, index$1.propTypes.func]),
  className: index$1.propTypes.string,
  compact: index$1.propTypes.bool,
  disabled: index$1.propTypes.bool,
  href: index$1.propTypes.string,
  icon: index$1.propTypes.node,
  label: index$1.propTypes.node.isRequired,
  labelStyle: index$1.propTypes.string,
  onClick: index$1.propTypes.func,
  style: index$1.propTypes.object,
  title: index$1.propTypes.string
};

exports.default = BadgeBase;
//# sourceMappingURL=BadgeBase.js.map
