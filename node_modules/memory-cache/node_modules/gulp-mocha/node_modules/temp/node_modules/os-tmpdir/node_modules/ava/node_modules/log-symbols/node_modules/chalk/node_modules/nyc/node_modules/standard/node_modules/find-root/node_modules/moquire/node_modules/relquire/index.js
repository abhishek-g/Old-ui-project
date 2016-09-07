var path = require('path')
var fs = require('fs')
var SEP = path.sep

var packageBase = findBase()

function relquire (id, base) {
  if (id.indexOf('~/') !== 0 ) {
    throw new Error('use `require` instead for globally namespaced or relative requires')
  }
  id = resolve(id, base)
  return require(id)
}

function resolve(id, base) {
  if (id.indexOf('~/') !== 0 ) {
    return id
  }
  
  id = '.' + id.substr(1)
  id = path.resolve(base || packageBase, id)
  return id
}

function findBase(start) {
  start = start || module.parent.filename
  if (typeof start === 'string') {
    start = start.split(SEP)
  }
  start.pop()
  var path = start.join(SEP)
  if (fs.existsSync(path + '/package.json')) {
    return path
  }
  return findBase(start)
}

module.exports = relquire
module.exports.findBase = findBase
module.exports.resolve = resolve