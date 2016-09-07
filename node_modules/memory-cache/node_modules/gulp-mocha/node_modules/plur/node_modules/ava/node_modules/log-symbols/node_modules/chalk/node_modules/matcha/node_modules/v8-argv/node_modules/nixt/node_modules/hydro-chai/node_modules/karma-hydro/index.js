/**
 * Core dependencies.
 */

var path = require('path');
var dirname = path.dirname;

/**
 * Create path.
 *
 * @param {String} pattern
 * @returns {Object}
 * @api private
 */

function createPattern(pattern) {
  return {
    pattern: pattern,
    included: true,
    served: true,
    watched: false
  };
}

/**
 * Insert hydro into the loaded files.
 *
 * @param {Array} files
 * @api public
 */

function init(config) {
  var hydroConfig = config.hydro || {};
  var hydroJs = hydroConfig.path || dirname(dirname(require.resolve('hydro'))) + '/dist/hydro.js';
  var before = hydroConfig.before || [];

  config.files.unshift(createPattern(__dirname + '/adapter.js'));
  config.files.unshift(createPattern(hydroJs));

  before.reverse().forEach(function(file) {
    config.files.unshift(createPattern(path.resolve(file)));
  });
}

/**
 * Inject.
 */

init.$inject = [ 'config' ];

/**
 * Primary export.
 */

module.exports = {
  'framework:hydro': [ 'factory', init ]
};
