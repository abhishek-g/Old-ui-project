/**
 * Test config.
 *
 * @param {Object} hydro
 * @api public
 */

module.exports = function(hydro) {
  var bdd = require('./index');

  hydro.set({
    plugins: [bdd],
    attach: global,
    formatter: 'hydro-simple',
    globals: {
      assert: require('simple-assert')
    },
    tests: [
      'test/*.js'
    ]
  });

  global.__hydro = hydro;
};
