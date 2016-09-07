// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isObject’
 *
 * @param {object} test
 */
exports.isObject = function(test) {
  
  var result = Robb.isObject( {} );

  test.strictEqual( result, true );
  test.done();

};