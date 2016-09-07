/**
 * External dependencies.
 */

var Formatter = require('hydro-formatter');

/**
 * Primary export.
 */

module.exports = function(hydro) {
  var formatter = new Formatter
  formatter.afterAll = function() {
    this.displayResult();
    this.displayFailed();
  };
  formatter.use(hydro);
};
