// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isInt’
 *
 * @param {object} test
 */
exports.isInt = function(test) {
  
  var ints = [
    1,
    2,
    3,
    4,
    5,
    6,
    -1,
    -2
  ];

  ints.forEach(function(int) {
    var res = Robb.isInt( int );
    test.strictEqual( res, true );
  });

  test.done();

};