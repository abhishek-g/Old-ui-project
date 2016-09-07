// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isIpv6’
 *
 * @param {object} test
 */
exports.isIpv6 = function(test) {

  test.strictEqual( Robb.isIp('2001:0db8:85a3:0000:0000:8a2e:0370:7334'), true );
  test.strictEqual( Robb.isIpv4('2001:0db8:85a3:0000:0000:8a2e:0370:7334'), false );
  test.strictEqual( Robb.isIpv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334'), true );
  test.done();

};