var assert = require('assert')

require('../lib/global')

describe('global', function() {
  it('should assert for existence of globals', function() {
    //test for colors
    assert("hi".red)
  })
})

