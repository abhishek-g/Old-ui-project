// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isEmpty’
 *
 * @param {object} test
 */
exports.isEmpty = function(test) {
  
  var succ = [
    {},
    [],
    ''
  ];

  succ.forEach(function(i) {
    var res = Robb.isEmpty( i );
    test.strictEqual( res, true );
  });

  test.done();
  
};