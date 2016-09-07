// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isBoolean’
 *
 * @param {object} test
 */
exports.isBoolean = function(test) {
  
  var booleans = [
    true,
    false
  ];

  booleans.forEach(function(arr) {
    var result = Robb.isBoolean( arr );
    test.strictEqual( result, true );
  });
  
  var fails = [
    0,
    1,
    2,
    null,
    {},
    [],
    null,
    undefined
  ];

  fails.forEach(function(arr) {
    var result = Robb.isBoolean( arr );
    test.strictEqual( result, false );
  });
  
  test.done();
  
};
