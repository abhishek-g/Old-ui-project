var chai = require('chai')
chai.should()

var relquire = require('../../index')

module.exports = function () {
  describe('works from multiple folders', function () {
    it('can load paths relative to the top level package.json directory', function () {
      var bar = require('../bar')
      var bar2 = relquire('~/test/bar')
      bar2.should.equal(bar)
    })
  })  
}
