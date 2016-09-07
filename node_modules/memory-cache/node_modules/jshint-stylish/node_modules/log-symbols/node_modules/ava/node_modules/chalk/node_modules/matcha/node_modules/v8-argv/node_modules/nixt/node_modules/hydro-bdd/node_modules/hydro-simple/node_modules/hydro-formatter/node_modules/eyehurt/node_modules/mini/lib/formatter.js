/**
 * Dependencies.
 */

var color = require('eyehurt');

/**
 * Formatter.
 *
 * @param {Runner} runner
 * @constructor
 */

function Formatter(runner) {
  var self = this;
  var failed = 0;
  var total = 0;

  // cache the total number of tests
  runner.on('start', function(num) {
    total = num;
  });

  // report filed tests immediately
  runner.on('failed', function(test, err) {
    failed++;
    self.reportFailure(failed, test, err);
  });

  // report the results
  runner.on('end', function() {
    if (!failed) {
      console.log(color('OK: ' + total + ' tests', 'green'));
    } else {
      console.error('NOT OK: ' + failed + '/' + total + ' tests');
    }
  });
}

/**
 * Report a failed tests.
 *
 * @param {Number} seq
 * @param {Tests} test
 * @param {Error} error
 * @api private
 */

Formatter.prototype.reportFailure = function(num, test, err) {
  console.error(num + ') ' + test.desc);
  console.error(color(err.stack, 'red'));
  console.error('');
};

/**
 * Primary export.
 */

module.exports = Formatter;
