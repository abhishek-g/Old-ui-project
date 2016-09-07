/**
 * Core dependencies.
 */

var tty = require('tty');

/**
 * Enabled.
 */

var enabled = tty.isatty(1) && tty.isatty(2);

/**
 * Colors.
 */

var colors = {
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  blue: '\u001b[34m',
  magenta: '\u001b[35m',
  cyan: '\u001b[36m',
  gray: '\u001b[90m',
};

/**
 * Reset.
 */

var reset = '\u001b[0m';

/**
 * Parse and colorize `str`.
 *
 * @param {String} str
 * @param {Boolean} enabled
 * @api public
 */

function parse(str, options) {
  options = options || {};
  options.parse = false;

  return str.replace(/\[(.*?)\]\((\w+)\)/g, function(_, str, color) {
    return colorize(str, color, options);
  });
}

/**
 * Colorize `str`.
 *
 * @param {String} str
 * @param {String} color
 * @param {Object} options
 * @api public
 */

function colorize(str, color, options) {
  var colors = module.exports.colors;

  if (Object(color) === color) {
    options = color;
    color = '';
  }

  options = options || {};

  options.enable = options.hasOwnProperty('enable')
    ? options.enable
    : enabled;

  if (options.parse) return parse(str, options)
  if (!options.enable) return str;
  if (!colors[color]) throw new Error('Unsupported color: ' + color);
  return colors[color] + str + reset;
}

/**
 * Primary export.
 */

module.exports = colorize;

/**
 * Export `parse`.
 */

module.exports.parse = parse;

/**
 * Export `colors`.
 */

module.exports.colors = colors;
