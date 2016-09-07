// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isNumber’
 *
 * @param {object} test
 */
exports.isNumber = function(test) {

  var numbers = [
    676,
    737,
    157,
    617,
    303,
    545,
    183,
    893,
    773,
    253,
    686,
    12.12,
    212.2917,
    -21,
    -21.212
  ];
  
  numbers.forEach(function(num) {
    var result = Robb.isNumber( num );
    test.strictEqual( result, true );
  });

  test.done();

};