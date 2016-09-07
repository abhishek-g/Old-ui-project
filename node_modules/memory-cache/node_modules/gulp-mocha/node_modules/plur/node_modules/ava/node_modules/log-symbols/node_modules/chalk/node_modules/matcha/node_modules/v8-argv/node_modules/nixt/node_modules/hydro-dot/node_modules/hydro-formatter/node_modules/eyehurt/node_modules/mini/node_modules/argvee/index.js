/*!
 * argvee
 * Copyright (c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var assert = require('assert');

/*!
 * Primary Exports
 */

module.exports = Args;

/**
 * @param {Array} argv to process (default: process.argv)
 * @return {Argvee}
 * @api public
 */

function Args(args) {
  if (!(this instanceof Args)) return new Args(args);
  args = args || process.argv;
  if ('string' === typeof args) args = args.split(/\s/);
  assert(Array.isArray(args), 'argvee: argument or process.argv must be an array');

  this.args = args;
  this.commands = [];
  this.modes = [];
  this.params = {};

  parse(this);
}

/**
 * Filter/combine helpers
 *
 * @param {String} key to lookup
 * @param {String} ...
 * @return {Boolean|String|Array}
 */

Args.prototype.command = filter('commands');
Args.prototype.mode = filter('modes');
Args.prototype.param = filter('params');

/*!
 * ### filter(which)
 *
 * Constructs a helper function for each of the
 * three types of process.argv types. Returns function
 * to be mounted on to the Arg.prototype.
 *
 * @param {String} which argument type
 * @returns {Function}
 * @api private
 */

function filter(which) {
  return function() {
    var self = this;
    var modes = [].slice.call(arguments);
    var res = Array.isArray(this[which]) ? false : null;
    var i = 0;

    function check(el) {
      if (Array.isArray(self[which])) {
        return ~self[which].indexOf(el) ? true : null;
      } else {
        return el in self[which] ? self[which][el] : null;
      }
    }

    for (; i < modes.length; i++) {
      var val = check(modes[i]);
      if (val && !res) res = val;
      else if (val && res) {
        val = val.concat(res);
      }
    }

    return res;
  }
}


/*!
 * ### parse(args)
 *
 * Take the raw node.js args array and parse out
 * commands, modes, and parameters. Per node standard,
 * the first two elements are considered to be the executor
 * and file and irrelevant.
 *
 * @param {Array} process.argv
 * @ctx Args
 * @api private
 */

function parse(target) {
  var args = target.args;
  var isStr = false;
  var param_key = null;

  var commands = target.commands;
  var modes = target.modes;
  var params = target.params

  function checkParamKey() {
    if (param_key === null) return;
    modes.push(param_key);
    param_key = null;
  }

  function setKey(str) {
    param_key = str;
  }

  args.slice(2).forEach(function(part) {
    if (part.substr(0, 2) === '--') {
      checkParamKey();
      part = part.substr(2);
      return ~part.indexOf('=') ? addParam(params, part) : setKey(part);
    }

    if (part[0] === '-') {
      checkParamKey();
      part = part.substr(1);
      if (part.length === 1) return setKey(part);
      if (~part.indexOf('=')) return addParam(params, part);
      target.modes = modes.concat(part.split(''));
      return;
    }

    part = Number(part) || part;

    if (null === param_key) {
      return commands.push(part);
    }

    if (part[0] === '"' && !isStr) {
      isStr = true;
      addParam(params, param_key, part.substr(1));
    } else if (isStr && part[part.length - 1] === '"') {
      isStr = false;
      appendParam(params, param_key, part.substr(0, part.length - 1));
      param_key = null;
    } else if (isStr) {
      appendParam(params, param_key, part);
    } else {
      addParam(params, param_key, part);
      param_key = null;
    }
  });

  checkParamKey();
};


/*!
 * Add a param to the param list.
 *
 * @param {Array} params array
 * @param {String} key
 * @param {Number|String} value
 */

function addParam(params, key, value) {
  if (3 > arguments.length) {
    var parts = key.split('=');
    key = parts[0];
    value = parts[1];
  }

  (params[key] || (params[key] = [])).push(value);
}

/*!
 * Append a string to the last param. Used
 * when params are surrounded in quotes.
 *
 * @param {Array} params array
 * @param {String} key
 * @param {Number|String} value
 */

function appendParam(params, key, value) {
  var curr = params[key];
  curr[curr.length - 1] += ' ' + value;
}
