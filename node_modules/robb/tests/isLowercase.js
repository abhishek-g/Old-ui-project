// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isLowercase’
 *
 * @param {object} test
 */
exports.isLowercase = function(test) {
  
  var lowercase = [
    ['a'],
    ['abc'],
    ['defgh'],
    ['a', 'b', 'c']
  ];
  
  lowercase.forEach(function(input) {
    var result = Robb.isLowercase.apply( Robb, input );
    test.strictEqual( result, true );
  });
  
  var fails = [
    [],
    [null],
    [undefined],
    ['a', null, 'a'],
    ['ABC', 'S'],
    ['A']
  ];

  fails.forEach(function(input) {
    var result = Robb.isLowercase.apply( Robb, input );
    test.strictEqual( result, false );
  });
  
  test.done();

};