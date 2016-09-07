/**
 * Set BDD proxies.
 *
 * @param {Object} hydro
 * @api public
 */

module.exports = function(hydro) {
  hydro.set('proxies', 'describe', 'addSuite');
  hydro.set('proxies', 'context', 'addSuite');
  hydro.set('proxies', 'it', 'addTest');

  hydro.set('proxies', 'before', 'before');
  hydro.set('proxies', 'beforeAll', 'beforeAll');
  hydro.set('proxies', 'beforeNext', 'beforeNext');

  hydro.set('proxies', 'after', 'after');
  hydro.set('proxies', 'afterAll', 'afterAll');
  hydro.set('proxies', 'afterNext', 'afterNext');
};
