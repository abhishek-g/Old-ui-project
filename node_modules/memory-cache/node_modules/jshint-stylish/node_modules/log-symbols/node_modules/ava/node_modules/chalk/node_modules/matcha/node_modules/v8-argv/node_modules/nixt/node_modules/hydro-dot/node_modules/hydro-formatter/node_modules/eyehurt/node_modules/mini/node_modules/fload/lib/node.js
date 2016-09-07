/**
 * Core dependencies.
 */

var fs = require('fs');
var path = require('path');
var resolve = path.resolve;
var normalize = path.normalize;
var noop = function(_, fn) { fn(); };

/**
 * External dependencies.
 */

var glob = require('glob');

/**
 * Find files based on `patterns`.
 *
 * @param {Array} patterns
 * @returns {Array}
 * @api private
 */

function find(patterns) {
  var ret = [];

  (patterns || []).forEach(function(pattern) {
    glob(pattern, { sync: true }).forEach(function(file) {
      if (fs.statSync(file).isDirectory()) {
        ret = ret.concat(find([normalize(file + '/*')]));
      } else {
        ret.push(resolve(file));
      }
    });
  })

  return ret;
}

/**
 * Load JavaScript `files`.
 * Glob patterns are acceptable too.
 *
 * @param {Array} files/patterns
 * @param {Object} callbacks - `pre`, `post`, `done`
 * @api public
 */

function load(patterns, callbacks) {
  var files = find(patterns);

  callbacks.pre = callbacks.pre || function(_, fn) {
    fn();
  };

  callbacks.post = callbacks.post || function(_, _, fn) {
    fn();
  };

  (function next() {
    var file = files.shift();
    if (!file) return callbacks.done();
    callbacks.pre(file, function() {
      var exprts = require(file);
      callbacks.post(file, exprts, next);
    });
  })();
}

/**
 * Primary export.
 */

module.exports = load;
