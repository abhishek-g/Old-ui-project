/**
 * External dependencies.
 */

var Formatter = require('hydro-formatter');

/**
 * Primary export.
 */

module.exports = function(hydro){
  var dot = new Formatter;
  dot.beforeAll = function() {
    this.println();
    this.print(this.padding);
  };
  dot.afterTest = function(test) {
    if (test.status === 'skipped') return;
    this.print(this.color('.', this.statusColor[test.status]));
  };
  dot.afterAll = function() {
    this.println();
    this.displayResult();
    this.displayFailed();
  };
  dot.use(hydro);
  return dot;
};
