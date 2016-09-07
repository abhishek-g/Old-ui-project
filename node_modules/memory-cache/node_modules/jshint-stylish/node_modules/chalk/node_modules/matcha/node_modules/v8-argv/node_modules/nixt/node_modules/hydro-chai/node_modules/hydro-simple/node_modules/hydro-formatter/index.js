/**
 * External dependencies.
 */

var path = require('path');
var extend = require('super').extend;
var ms = require('ms');
var color = require('eyehurt');
var inspect = require('loupe');
var basename = path.basename;
var extname = path.extname;

/**
 * Noop.
 */

var noop = function(){};

/**
 * Base formatter.
 *
 * @constructor
 */

function Formatter() {
  this.out = process.stdout;
  this.padding = new Array(4).join(' ');
  this.tests = [];
  this.passed = [];
  this.failed = [];
  this.pending = [];
  this.skipped = [];
  this.colors = null;
  this.statusColor = {
    failed: 'red',
    passed: 'green',
    skipped: 'gray',
    pending: 'yellow'
  };
}

/**
 * Inheritance.
 *
 * @api public
 */

Formatter.extend = extend;

/**
 * Setup.
 *
 * @param {Hydro} hydro
 * @api public
 */

Formatter.prototype.use = function(hydro) {
  var self = this;

  this.hydro = hydro;
  this.colors = !(hydro.get('colors') === false);

  hydro.on('post:test', function(test) {
    self.tests.push(test);
    self[test.status].push(test);
  });

  hydro.on('pre:all', this.beforeAll.bind(this));
  hydro.on('pre:suite', this.beforeSuite.bind(this));
  hydro.on('pre:test', this.beforeTest.bind(this));
  hydro.on('post:test', this.afterTest.bind(this));
  hydro.on('post:suite', this.afterSuite.bind(this));
  hydro.on('post:all', this.afterAll.bind(this));
};

/**
 * Before all tests.
 *
 * @api public
 */

Formatter.prototype.beforeAll = noop;

/**
 * Before test suite.
 *
 * @api public
 */

Formatter.prototype.beforeSuite = noop;

/**
 * Before each tests.
 *
 * @api public
 */

Formatter.prototype.beforeTest = noop;

/**
 * After test.
 *
 * @api public
 */

Formatter.prototype.afterTest = noop;

/**
 * After test suite.
 *
 * @api public
 */

Formatter.prototype.afterSuite = noop;

/**
 * After all tests.
 *
 * @api public
 */

Formatter.prototype.afterAll = noop;

/**
 * Attach `ms` for inheriting formatters.
 */

Formatter.prototype.ms = ms;

/**
 * Attach `color` for inheriting formatters.
 */

Formatter.prototype.color = function(str, col, options) {
  if (Object(col) === col) {
    options = col;
    col = '';
  }

  options = options || {};

  if (this.colors === false) {
    options.enable = this.colors;
  }

  return color(str, col, options);
};

/**
 * Print `msg`.
 *
 * @param {String} msg
 * @api private
 */

Formatter.prototype.print = function(msg) {
  msg = msg || '';
  this.out.write(msg);
};

/**
 * Print `msg` + \n.
 *
 * @param {String} msg
 * @api private
 */

Formatter.prototype.println = function(msg) {
  msg = msg || '';
  msg = this.padding + msg;
  this.print(msg + '\n');
};

/**
 * Display failed tests.
 *
 * @api private
 */

Formatter.prototype.displayFailed = function() {
  this.failed.forEach(function(test, i) {
    var err = test.error;

    this.println((i + 1) + ') ' + test.fullTitle());
    this.println();

    var type = err.constructor.name;
    if (type === 'AssertionError') type = '';
    else type += ': ';

    this.println('   ' + this.color(type + err.message, 'red'));

    if (err.actual) {
      this.println();
      this.println(this.color('   expected: ' + inspect(err.expected), 'red'));
      this.println(this.color('        got: ' + inspect(err.actual), 'red'));
    }

    if (err.showStack !== false
    && (!this.hydro || this.hydro.get('showStack') !== false)) {
      this.printStack(err.stack);
    }

    if (i !== this.failed.length - 1) {
      this.println();
    }
  }, this);
};

/**
 * Format & print error stack.
 *
 * @param {String|null} error stack
 * @api private
 */

Formatter.prototype.printStack = function(stack) {
  var lines = (stack || '').split('\n');

  if (!lines.length) {
    return;
  }

  this.println();

  lines.forEach(function(line, i) {
    if (i === 0) return;
    this.println(this.color('   ' + line.trim(), 'gray'));
  }, this);
};

/**
 * Display test results.
 *
 * @api private
 */

Formatter.prototype.displayResult = function() {
  var failing = this.failed.length;
  var skipped = this.skipped.length;
  var pending = this.pending.length;
  var passing = this.tests.length - skipped - failing - pending;
  var time = this.tests.reduce(function(sum, test) {
    return sum + test.time;
  }, 0);

  this.println();

  if (this.tests.length === 0) {
    this.println('0 tests ' + this.color('(' + this.ms(0) + ')', 'gray'));
  } else {
    this.println(''
      + this.color(passing ? passing + ' passing ' : '', 'green')
      + this.color(pending ? pending + ' pending ' : '', 'yellow')
      + this.color(skipped ? skipped + ' skipped ' : '', 'blue')
      + this.color(failing ? failing + ' failing ' : '', 'red')
      + this.color('(' + this.ms(time) + ')', 'gray')
    );
  }

  this.println();
};

/**
 * Primary export.
 */

module.exports = Formatter;
