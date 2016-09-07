// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isUnsignedInt’
 *
 * @param {object} test
 */
exports.isUnsignedInt = function(test) {

  var ints = [
    1,
    2,
    3,
    4,
    5,
    6
  ];

  ints.forEach(function(int) {
    var res = Robb.isInt( int );
    test.strictEqual( res, true );
  });
  
  var fails = [
    -1212,
    -2112,
    -12.21
  ];

  fails.forEach(function(item) {
    test.strictEqual( Robb.isUnsignedInt(item), false );
  });

  test.done();

};