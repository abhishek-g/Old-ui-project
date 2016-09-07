var fs = require('fs')
  , path = require('path');

module.exports = function tree (base, next) {
  var results = [];
  fs.readdir(base, function(err, list) {
    if (err) return next(err);
    var pending = list.length;
    if (!pending) next(null, []);
    list.forEach(function(file) {
      file = base + '/' + file;
      fs.stat(file, function(err, stat) {
        if (err) next(err);
        if (stat && stat.isDirectory()) {
          tree(file, function(err, res) {
            if (err) next(err);
            results = results.concat(res);
            if (!--pending) next(null, results);
          });
        } else {
          var ext = path.extname(file).toLowerCase();
          results.push(file);
          if (!--pending) next(null, results);
        }
      });
    });
  });
};
