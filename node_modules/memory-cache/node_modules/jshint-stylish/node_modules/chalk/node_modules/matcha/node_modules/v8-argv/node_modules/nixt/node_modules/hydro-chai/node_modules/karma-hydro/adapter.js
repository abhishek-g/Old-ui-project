;(function() {

  /**
   * Root.
   */

  var global = this;

  /**
   * Format error.
   *
   * @param {Error} error
   * @returns {String}
   * @api private
   */

  var formatError = function(error) {
    if (!error.stack) return error.message;
    var stack = error.stack;
    var firstLine = stack.substring(0, stack.indexOf('\n'));
    if (error.message && firstLine.indexOf(error.message) === -1) stack = error.message + '\n' + stack;
    return stack.replace(/\n.+\/adapter(\/lib)?\/hydro.js\?\d*\:.+(?=(\n|$))/g, '');
  };

  /**
   * Karma formatter.
   *
   * @param {Object} tc
   * @constructor
   */

  function KarmaFormatter(tc) {
    this.tc = tc;
  }

  /**
   * Bootstrap.
   *
   * @param {Hydro} hydro
   * @api public
   */

  KarmaFormatter.prototype.use = function(hydro) {
    var tc = this.tc;

    hydro.on('pre:all', function() {
      tc.info({ total: hydro.tests().length });
    });

    hydro.on('post:all', function() {
      tc.complete({ coverage: global.__coverage__ });
    });

    hydro.on('post:test', function(test) {
      var skipped = test.status === 'pending' || test.status === 'skipped';
      var suite = test.suite;
      var suites = [];
      var errors = [];

      if (test.error) {
        errors.push(formatError(test.error));
      }

      while (!suite.parent) {
        suites.unshift(suite.title);
        suite = suite.parent;
      }

      tc.result({
        id: '',
        description: test.title,
        suite: suites,
        success: test.status === 'passed',
        skipped: skipped,
        time: test.time,
        log: errors
      });
    });
  };

  /**
   * Hydro.
   */

  var hydro = Hydro();

  /**
   * Configurations.
   */

  var config = (global.__karma__.config || {}).hydro || {};
  config.formatter = new KarmaFormatter(global.__karma__);
  hydro.set(config);

  /**
   * Check for instantaneous setup.
   */

  if (config.setup === true) {
    hydro.setup();
  }

  /**
   * Export hydro.
   */

  global.hydro = hydro;

  /**
   * Tell karma how to start the tests.
   */

  global.__karma__.start = function() {
    hydro.exec();
  };

}).call(this);
