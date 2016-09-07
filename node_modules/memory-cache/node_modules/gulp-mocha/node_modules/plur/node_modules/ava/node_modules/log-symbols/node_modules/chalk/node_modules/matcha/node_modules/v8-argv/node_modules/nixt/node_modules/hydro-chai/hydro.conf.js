/**
 * Test config.
 *
 * @param {Object} hydro
 * @api public
 */

module.exports = function(hydro) {
  var chai = require('./index');

  hydro.set({
    plugins: [chai],
    chai: {
      styles: ['expect', 'assert', 'should'],
      plugins: ['chai-spies'],
      diff: true,
      stack: true,
      global: true
    },
    attach: global,
    proxies: {
      test: 'addTest'
    },
    suite: 'hydro-chai',
    formatter: 'hydro-simple',
    globals: {
      sassert: require('simple-assert')
    },
    tests: [
      'test/*.js'
    ]
  });
};
