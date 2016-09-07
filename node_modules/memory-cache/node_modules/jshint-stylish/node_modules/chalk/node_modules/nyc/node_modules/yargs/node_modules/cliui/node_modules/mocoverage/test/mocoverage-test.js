var assert = require('assert'),
  path = require('path'),
  sinon = require('sinon');

describe('MoCoverage', function() {

  var MoCoverage = require(
    path.resolve(__dirname, '../')
  );

  it("stores both reporters on MoCoverage instance", function() {
    var mo = new MoCoverage(sinon.mock(), {});
    assert.equal(typeof mo._out.stats, 'object');
    assert.equal(typeof mo._cov, 'object');
  });
});
