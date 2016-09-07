
var randomInt = exports.randomInt = function (min, max) {
  min = min == null ? 1 : min
  max = max == null ? 100 : max
  return Math.round(Math.random()*(max - min)) + min
}

exports.randomOf = function (array) {
  return array[randomInt(0, array.length - 1)]
}