// Loads ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isAlpha’
 *
 * @param {object} test
 */
exports.isAlpha = function(test) {

  var alphas = [
    ['abc'],
    ['ABC'],
    ['Abc'],
    ['aBc'],
    ['abc', 'ABC', 'lorem'],
    ['ABC', 'lorem']
  ];

  alphas.forEach(function(item) {
    var result = Robb.isAlpha.apply( Robb, item );
    test.strictEqual( result, true );
  });

  var fails = [
    ['123'],
    ['+@#$~^*{}'],
    ['lorem ipsum'],
    [' '],
    ['123', 'lorme ipsum', 'abc'],
    ['abc', 'lorme ipsum', 'abc'],
    ['lorme ipsum', 'lorme ipsum', 'lorme ipsum'],
    ['lorem', '', 'lorem'],
    [''],
    ['', ''],
    ['abc', null, 'abc'],
    ['abc', undefined, 'abc'],
    []
  ];

  fails.forEach(function(item) {
    var result = Robb.isAlpha.apply( Robb, item );
    test.strictEqual( result, false );
  });

  test.done();

}