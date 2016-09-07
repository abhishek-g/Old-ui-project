var list   = require('./words')
  , random = require('secure-random')
  , m      = 32; // 256^2 / 2048

if (list.length != 2048)
  throw new Error('This script expected to be used on an 2048 long word list. \
                   Changing the word list requires updating the script.');

function word() {
  var bytes = random(2)
    , r = bytes[0]*256+bytes[1];
  return list[Math.floor(r/m)];
}

module.exports = function(n) {
  if (n == null) return word();
  
  var words = [];
  for (i=0; i<n; i++) words.push(word());
  return words;
}
