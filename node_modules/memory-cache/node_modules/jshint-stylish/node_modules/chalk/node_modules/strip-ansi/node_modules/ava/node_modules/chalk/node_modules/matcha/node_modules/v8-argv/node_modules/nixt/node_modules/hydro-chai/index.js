/**
 * External dependencies.
 */

var loa = require('loa');

/**
 * Root.
 */

var root = typeof window === 'undefined' ? global : window;

/**
 * Chai.js plugin.
 *
 * Options:
 *
 *    - chai:   object/string a reference to chai
 *    - styles: array/string  should, expect, assert
 *    - stack:  boolean       include stack
 *    - diff:   boolean       show diff
 *    - plugins array         list of chai.js plugins
 *
 * @param {Object} hydro
 * @param {Object} util
 * @api public
 */

module.exports = function(hydro, util) {
  var opts = hydro.get('chai') || {};
  var chai = loa(opts.chai || 'chai');
  var styles = util.toArray(opts.styles);

  opts.plugins = opts.plugins || [];

  util.forEach(styles, function(style) {
    switch (style) {
      case 'expect':
      case 'assert':
        hydro.set('globals', style, chai[style]);
        break;
      case 'should':
        root.should = undefined;
        root.should = chai.should();
        break;
    }
  });

  if (opts.hasOwnProperty('stack')) {
    chai.config.includeStack = opts.stack;
  }

  if (opts.hasOwnProperty('diff')) {
    chai.config.showDiff = opts.diff;
  }

  if (opts.hasOwnProperty('global')) {
    hydro.set('globals', 'chai', chai);
  }

  for (var i = 0, len = opts.plugins.length; i < len; i++) {
    chai.use(loa(opts.plugins[i]));
  }
};
