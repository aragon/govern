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
var containsComponent = require('./contains-component.js');
require('./css.js');
require('./miscellaneous.js');
require('./environment.js');
require('./font.js');
var url = require('./url.js');
require('./constants.js');
require('./breakpoints.js');
require('./springs.js');
require('./text-styles.js');
require('./theme-dark.js');
require('./theme-light.js');
var Theme = require('./Theme.js');
require('./extends-023d783e.js');
require('./objectWithoutProperties-c6d3675c.js');
require('./_baseGetTag-42b4dd3e.js');
var Viewport = require('./Viewport-819c53c9.js');
var Layout = require('./Layout.js');
require('./objectWithoutPropertiesLoose-1af20ad0.js');
require('react-dom');
require('./web-7cbdbd84.js');
require('./getDisplayName-7f913e84.js');
var PublicUrl = require('./PublicUrl-7d4b6d6d.js');
var ToastHub = require('./ToastHub.js');
var Root = require('./Root-8693e46b.js');
require('./RootPortal.js');
var BaseStyles = require('./BaseStyles.js');
var ScrollView = require('./ScrollView.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var _styled__default = /*#__PURE__*/_interopDefaultLegacy(_styled);

var _initContainsComponen = containsComponent.initContainsComponent(),
    ContainsAppViewProvider = _initContainsComponen.Provider,
    useContainsAppView = _initContainsComponen.useContains,
    useRegisterAppView = _initContainsComponen.useRegister;

var _StyledScrollView = _styled__default['default'](ScrollView.default).withConfig({
  displayName: "Main___StyledScrollView",
  componentId: "sc-1n64cjc-0"
})(["height:100vh"]);

function Main(_ref) {
  var assetsUrl = _ref.assetsUrl,
      children = _ref.children,
      layout = _ref.layout,
      scrollView = _ref.scrollView,
      theme = _ref.theme;
  var containsAppView = useContainsAppView();

  if (layout === undefined) {
    layout = !containsAppView;
  }

  if (scrollView === undefined) {
    scrollView = !containsAppView;
  } // Optionally wrap `children` with Layout and/or ScrollView


  var content = layout ? /*#__PURE__*/React__default['default'].createElement(Layout.default, null, children) : children;
  content = scrollView ?
  /*#__PURE__*/
  // The main ScrollView is set to 100vh by default (best for Aragon apps)
  // Disable `scrollView` and insert your own if needed.
  React__default['default'].createElement(_StyledScrollView, null, content) : content;
  return /*#__PURE__*/React__default['default'].createElement(Root.Root.Provider, null, /*#__PURE__*/React__default['default'].createElement(Viewport.Viewport.Provider, null, /*#__PURE__*/React__default['default'].createElement(PublicUrl.PublicUrl.Provider, {
    url: url.ensureTrailingSlash(assetsUrl)
  }, /*#__PURE__*/React__default['default'].createElement(Theme.Theme, {
    theme: theme
  }, /*#__PURE__*/React__default['default'].createElement(BaseStyles.default, null), /*#__PURE__*/React__default['default'].createElement(ToastHub.default, null, content)))));
}

Main.propTypes = {
  assetsUrl: index.propTypes.string,
  children: index.propTypes.node,
  layout: index.propTypes.bool,
  scrollView: index.propTypes.bool,
  theme: Theme.Theme.propTypes.theme
};
Main.defaultProps = {
  assetsUrl: './aragon-ui/'
};
var Main$1 = (function (props) {
  return /*#__PURE__*/React__default['default'].createElement(ContainsAppViewProvider, null, /*#__PURE__*/React__default['default'].createElement(Main, props));
});

exports.default = Main$1;
exports.useContainsAppView = useContainsAppView;
exports.useRegisterAppView = useRegisterAppView;
//# sourceMappingURL=Main.js.map
