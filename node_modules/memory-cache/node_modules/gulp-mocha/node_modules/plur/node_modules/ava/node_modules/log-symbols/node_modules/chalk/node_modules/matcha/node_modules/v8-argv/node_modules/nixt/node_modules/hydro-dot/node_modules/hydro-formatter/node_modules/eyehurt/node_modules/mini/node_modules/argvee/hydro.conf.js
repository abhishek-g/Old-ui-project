/**
 * External dependencies.
 */

var chai = require('chai');

/**
 * Register `should`.
 */

global.should = chai.should();

/**
 * Include stack traces.
 */

chai.Assertion.includeStack = true;

/**
 * Expose `argvee`.
 */

global.argv = require('./');

/**
 * Test setup.
 *
 * @param {Hydro} hydro instance
 * @api public
 */

module.exports = function(hydro) {
  hydro.addSuite('argvee');

  hydro.addMethod('test', function() {
    return hydro.addTest.apply(hydro, arguments);
  });
};
