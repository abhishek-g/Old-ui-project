// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isArray’
 *
 * @param {object} test
 */
exports.isArray = function(test) {

  var arrays = [
    [],
    [1, 2, 3],
    ['a', 'b', 'c'],
    [function() {}, function() {}],
    [{}, {}, {}]
  ];
  
  arrays.forEach(function(arr) {
    var result = Robb.isArray( arr );
    test.strictEqual( result, true );
  });
  
  var fails = [
    '',
    null,
    undefined,
    {},
    function() {}
  ];
  
  fails.forEach(function(arr) {
    var result = Robb.isArray( arr );
    test.strictEqual( result, false );
  });  
  
  test.done();

};