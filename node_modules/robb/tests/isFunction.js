// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isFunction’
 *
 * @param {object} test
 */
exports.isFunction = function(test) {
  
  var functions = [
    function() {},
    (function() {})
  ];
  
  functions.forEach(function(fn) {
    var res = Robb.isFunction( fn );
    test.strictEqual( res, true );
  });

  test.done();

};