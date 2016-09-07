// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isPort’
 *
 * @param {object} test
 */
exports.isPort = function(test) {

  var ports = [
    ':80',
    ':800',
    ':8080'
  ];
  
  ports.forEach(function(port) {
    var result = Robb.isPort( port );
    test.strictEqual( result, true );
  });
  
  var fails = [
    null,
    undefined,
    '800',
    'Hello'
  ];
  
  fails.forEach(function(port) {
    var result = Robb.isPort( port );
    test.strictEqual( result, false );
  });

  test.done();
  
};