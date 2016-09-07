
var through = require('through');

module.exports = function(n) {
  var stream = through(write);

  function write(datum) {
    if (n === 0) this.queue(datum);
    else --n;
  }

  return stream;
};
