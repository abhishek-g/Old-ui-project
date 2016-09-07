var chai = require('chai')
chai.should()
var path = require('path')

var relquire = require('../index')

describe('relquire', function () {
  it('can load paths relative to the top level package.json directory', function () {
    var bar = require('./bar')
    var bar2 = relquire('~/test/bar')
    bar2.should.equal(bar)
  })

  it('can have a base dir passed in as an optional second parameter', function () {
    var bar = require('./bar')
    var bar2 = relquire('~/bar', __dirname)
    bar2.should.equal(bar)
  })
})

describe('findBase', function () {
  it('finds the closest package.json-containing directory', function () {
    var base = path.join(relquire.findBase(__dirname), 'test')
    base.should.equal(__dirname)
  })
})

describe('resolve', function () {
  it('resolves filenames relative to the package base dir', function () {
    relquire.resolve('~/test/test.js').should.equal(__filename)
  })
  it('takes an optional base dir override', function () {
    relquire.resolve('~/test.js', __dirname).should.equal(__filename)
  })
  it('passes through if path does not start with a tilde', function () {
    relquire.resolve('foo').should.equal('foo')
    relquire.resolve('../foo').should.equal('../foo')
    relquire.resolve('./qux').should.equal('./qux')
  })
})