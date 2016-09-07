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
