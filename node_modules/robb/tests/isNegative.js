// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isNegative’
 *
 * @param {object} test
 */
exports.isNegative = function(test) {
  
  var negative = [
    -1,
    -2,
    -100,
    -1.5,
    -3.89212
  ];

  negative.forEach(function(num) {
    var result = Robb.isNegative( num );
    test.strictEqual( result, true );
  });
  
  var fails = [
    null,
    undefined,
    '',
    1,
    2,
    3,
    4,
    5
  ];

  fails.forEach(function(num) {
    var result = Robb.isNegative( num );
    test.strictEqual( result, false );
  });

  test.done();

};