// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isPositive’
 *
 * @param {object} test
 */
exports.isPositive = function(test) {
  
  var positive = [
    1,
    2,
    3,
    4
  ];
  
  positive.forEach(function(num) {
    var result = Robb.isPositive( num );
    test.strictEqual( result, true );
  });
  
  test.done();
  
};