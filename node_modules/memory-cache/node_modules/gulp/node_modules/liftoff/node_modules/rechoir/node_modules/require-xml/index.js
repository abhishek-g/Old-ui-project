// @see http://nodejs.org/api/all.html#all_require_extensions
var fs = require('fs')
  , xml2json = require('xml2json');

require.extensions['.xml'] = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8');
  // Parse the file content and give to module.exports
  var content = xml2json.toJson(content);
  module.exports = content;
};

