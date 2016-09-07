// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isDate’
 *
 * @param {object} test
 */
exports.isDate = function(test) {
  
  var result = Robb.isDate( new Date() );
  test.strictEqual( result, true );

  var fails = [
    0,
    1,
    2,
    null,
    {},
    [],
    function() {},
    'Hello!',
    undefined,
    ''
  ];
  
  fails.forEach(function(item) {
    var result = Robb.isDate( item );
    test.strictEqual( result, false );
  });

  test.done();

};