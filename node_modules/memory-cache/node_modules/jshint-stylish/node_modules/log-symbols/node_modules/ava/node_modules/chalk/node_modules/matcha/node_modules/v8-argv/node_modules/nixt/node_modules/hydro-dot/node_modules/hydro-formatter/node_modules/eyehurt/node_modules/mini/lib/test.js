/**
 * Test.
 *
 * @param {String} description
 * @param {Function} the actual test
 * @constructor
 */

function Test(desc, fn) {
  this.desc = desc;
  this.fn = fn;
  this.async = !!fn.length;
}

/**
 * Primary export.
 */

module.exports = Test;
