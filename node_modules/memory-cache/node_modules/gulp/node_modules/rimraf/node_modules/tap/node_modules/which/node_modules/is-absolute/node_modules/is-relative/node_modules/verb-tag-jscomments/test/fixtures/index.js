var _ = require('lodash');

/**
 * ## Environment
 *
 * Create a new Environment object that will handle
 * storing everthing.
 */


var Environment = require('./environment.js');
var environment;
var initialized = false;
var setGlobal = true;


/**
 * ## foo(something, options)
 *
 * Specify a something that'll be used for any
 * of the commands that are called after it.
 *
 * ```js
 * foo('site', {})
 * ```
 *
 * @param {String} `something` name of the something to start using
 * @return {Object} return `this` to enable chaining
 */

function foo (something, config) {
  // ensure that the environment has been initialized
  foo._init();

  // set the specified something
  foo.something(something, config);

  // any `foo.config` call after this
  // will use the current something instead of global
  setGlobal = false;
  return foo;
}


/**
 * ## foo.config (config)
 *
 * Set the global configuration one first call.
 * If a `something` has already been specified, then
 * use the `something` config and merge the given `config`
 * in.
 *
 * Example:
 *
 * ```js
 * foo.config({
 *  options: { foo: 'bar' },
 *  src: 'path/to/src/files/*.hbs',
 *  dest: 'path/to/dest/'
 * });
 * ```
 *
 * @method foo.config
 * @param {Object} `config` configuration object
 * @return {Object} foo to enable chaining
 */

foo.config = function (config) {
  return foo.config.merge(config);
};
