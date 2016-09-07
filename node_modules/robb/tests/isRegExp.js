// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isRegExp’
 *
 * @param {object} test
 */
exports.isRegExp = function(test) {

  test.strictEqual( Robb.isRegExp( new RegExp() ), true );
  test.done();

};