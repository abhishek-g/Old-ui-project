// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isUndefined’
 *
 * @param {object} test
 */
exports.isUndefined = function(test) {

  test.strictEqual( Robb.isUndefined( undefined ), true );  
  test.done();

};