// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isAlphanumeric’
 *
 * @param {object} test
 */
exports.isAlphanumeric = function(test) {
  
  var strings = [
    ['abc123'],
    ['123abc'],
    ['a1b2c3'],
    ['abc'],
    ['ABC'],
    ['Abc'],
    ['123'],
    ['123', 'abc', 'ab23'],
    [123],
    [1, 2, 3]
  ];

  strings.forEach(function(item) {
    var result = Robb.isAlphanumeric.apply( Robb, item );
    test.strictEqual( result, true );
  });

  var fails = [
    [' '],
    ['lorem 123'],
    ['12 3', 'abc', 'ab23'],
    ['12 3', '', 'ab23'],
    ['abc', null, 'abc'],
    ['abc', undefined, 'abc'],
    []
  ];

  fails.forEach(function(item) {
    var result = Robb.isAlphanumeric.apply( Robb, item );
    test.strictEqual( result, false );
  });

  test.done();

};