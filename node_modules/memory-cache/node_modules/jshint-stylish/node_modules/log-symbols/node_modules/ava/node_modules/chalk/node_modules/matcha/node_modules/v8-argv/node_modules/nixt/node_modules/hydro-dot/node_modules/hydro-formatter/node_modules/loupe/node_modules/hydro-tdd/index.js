/**
 * Set UI proxies.
 *
 * @param {Object} hydro
 * @api public
 */

module.exports = function(hydro) {
  hydro.set('proxies', 'suite', 'addSuite');
  hydro.set('proxies', 'test', 'addTest');
};
