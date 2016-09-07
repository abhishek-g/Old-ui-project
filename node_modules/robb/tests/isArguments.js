// Load ‘Robb.js’
var Robb = require('../src/robb.js');

/**
 * Test ‘isArguments’
 *
 * @param {object} test
 */
exports.isArguments = function(test) {

  function testFunction() {
    test.strictEqual( Robb.isArguments( arguments ), true );
  }

  testFunction();

  var fails = [
    [],
    [1, 2, 3],
    {},
    { foo: 'bar' },
    'Lorem',
    function() {},
    null,
    undefined
  ];
  
  fails.forEach(function(item) {
    var result = Robb.isArguments( item );
    test.strictEqual( result, false );
  });

  test.done();

};