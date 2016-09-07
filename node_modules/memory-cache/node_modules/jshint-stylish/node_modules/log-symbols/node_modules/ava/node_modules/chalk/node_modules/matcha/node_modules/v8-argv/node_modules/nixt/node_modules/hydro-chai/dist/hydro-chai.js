;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("hydrojs-loa/index.js", function(exports, require, module){
/**
 * global || window
 */

var root = typeof global !== 'undefined' ? global : window;

/**
 * toString.
 */

var toString = Object.prototype.toString;

/**
 * Check if `input` is String, Function or Object.
 *
 * @param {String} type
 * @param {Mixed} input
 * @returns {Boolean}
 * @api private
 */

function is(type, input) {
  if (type === 'Object') return Object(input) === input;
  return toString.call(input) === '[object ' + type + ']';
}

/**
 * Check if `input` is a string and if so, either
 * refer to the global scope or `require` it. Then
 * call `loa` again in case the exported object
 * is a function.
 *
 * @param {Mixed} input
 * @api private
 */

function str(input) {
  if (!is('String', input)) return;
  return root[input] || (root.require || require)(input);
}

/**
 * Check if `input` is an object and if so assume it
 * is already an loa of something and return it
 * back;
 *
 * @param {Mixed} input
 * @api private
 */

function handeled(input) {
  if (is('Object', input) || is('Function', input)) return input;
}

/**
 * Raise error.
 *
 * @param {Mixed} input
 * @api private
 */

function raise(input) {
  throw new TypeError("loa: Can't handle: " + input);
}

/**
 * input is String             - global[input] || require(input)
 * input is Object|Function    - return input
 * else                        - throw
 *
 * @param {Mixed} input
 * @returns {Object}
 * @api public
 */

function loa(input) {
  return handeled(input) || str(input) || raise(input);
};

/**
 * Primary export.
 */

module.exports = loa;

});
require.register("hydro-chai/index.js", function(exports, require, module){
/**
 * External dependencies.
 */

var loa = require('loa');

/**
 * Root.
 */

var root = typeof window === 'undefined' ? global : window;

/**
 * Chai.js plugin.
 *
 * Options:
 *
 *    - chai:   object/string a reference to chai
 *    - styles: array/string  should, expect, assert
 *    - stack:  boolean       include stack
 *    - diff:   boolean       show diff
 *    - plugins array         list of chai.js plugins
 *
 * @param {Object} hydro
 * @param {Object} util
 * @api public
 */

module.exports = function(hydro, util) {
  var opts = hydro.get('chai') || {};
  var chai = loa(opts.chai || 'chai');
  var styles = util.toArray(opts.styles);
  var plugin = null;

  opts.plugins = opts.plugins || [];

  util.forEach(styles, function(style) {
    switch (style) {
      case 'expect':
      case 'assert':
        hydro.set('globals', style, chai[style]);
        break;
      case 'should':
        root.should = undefined;
        root.should = chai.should();
        break;
    }
  });

  if (opts.hasOwnProperty('stack')) {
    chai.Assertion.includeStack = opts.stack;
  }

  if (opts.hasOwnProperty('diff')) {
    chai.Assertion.showDiff = opts.diff;
  }

  if (opts.hasOwnProperty('global')) {
    hydro.set('globals', 'chai', chai);
  }

  for (var i = 0, len = opts.plugins.length; i < len; i++) {
    chai.use(loa(opts.plugins[i]));
  }
};

});
require.alias("hydrojs-loa/index.js", "hydro-chai/deps/loa/index.js");
require.alias("hydrojs-loa/index.js", "hydro-chai/deps/loa/index.js");
require.alias("hydrojs-loa/index.js", "loa/index.js");
require.alias("hydrojs-loa/index.js", "hydrojs-loa/index.js");
require.alias("hydro-chai/index.js", "hydro-chai/index.js");if (typeof exports == "object") {
  module.exports = require("hydro-chai");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("hydro-chai"); });
} else {
  this["hydro-chai"] = require("hydro-chai");
}})();