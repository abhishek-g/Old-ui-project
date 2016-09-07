// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isIp’
 *
 * @param {object} test
 */
exports.isIp = function(test) {
  
  var ips = [
    '192.168.0.1',
    '110.138.236.49',
    '110.138.245.56',
    '110.139.180.151',
    '110.139.180.151',
    '110.139.197.249',
    '110.139.205.95'
  ];

  ips.forEach(function(ip) {
    test.strictEqual( Robb.isIp(ip), true );
  });

  test.done();

};