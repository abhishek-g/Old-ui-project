// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isDecimal’
 *
 * @param {object} test
 */
exports.isDecimal = function(test) {
  
  var decimals = [
    1,
    10,
    20,
    30,
    1.11,
    1.23,
    1.30,
    230.36
  ];
  
  decimals.forEach(function(decimal) {
    var result = Robb.isDecimal( decimal );
    test.strictEqual( result, true );
  });

  var fails = [
    1.123981273,
    19723.129319
  ];

  fails.forEach(function(decimal) {
    var result = Robb.isDecimal( decimal );
    test.strictEqual( result, false );
  });  
  
  test.done();

};