/**
 * Dependencies.
 */

var loader = require('fload');
var tryc = require('tryc');
var Emitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var Test = require('./test');

/**
 * Test Runner.
 *
 * Events:
 *
 *   - `start`   before running the tests
 *   - `end`     after all tests
 *   - `failed`  after failed test
 *   - `passed`  after passed test
 *
 * @param {Array} files to load.
 * @constructor
 */

function Runner(files) {
  this.files = files;
  this.load = loader;
}

/**
 * Inherits from `EventEmitter`.
 */

inherits(Runner, Emitter);

/**
 * Run the tests.
 *
 * @param {Function} fn
 * @api public
 */

Runner.prototype.run = function(fn) {
  var self = this;
  var tests = [];

  global.test = function(desc, fn) {
    tests.push(new Test(desc, fn));
  };

  this.load(this.files, {
    done: function() {
      self.perform(tests);
    }
  });
};

/**
 * Execute the loaded tests.
 *
 * @param {Array} tests
 * @api private
 */

Runner.prototype.perform = function(tests) {
  var self = this;

  var done = function() {
    self.emit('end');
  };

  this.emit('start', tests.length);

  (function next() {
    var test = tests.shift();
    if (!test) return done();

    tryc(function(done) {
      if (test.async) return test.fn(done);
      test.fn();
      done();
    }, function(err) {
      if (err) {
        self.emit('failed', test, err);
      } else {
        self.emit('passed', test);
      }
      next();
    });
  })();
};

/**
 * Primary export.
 */

module.exports = Runner;
