// @see http://nodejs.org/api/all.html#all_require_extensions
var fs = require('fs')
  , ini = require('node-ini');

require.extensions['.ini'] = function(module, filename) {
  // Parse the file content and give to module.exports
  var content = ini.parseSync(filename);;
  module.exports = content;
};

