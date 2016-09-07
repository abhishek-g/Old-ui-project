// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isNull’
 *
 * @param {object} test
 */
exports.isNull = function(test) {

  var result = Robb.isNull( null );
  test.strictEqual( result, true );

  test.done();
  
};