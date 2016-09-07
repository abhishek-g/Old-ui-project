var fs = require('fs')
  , path = require('path');

module.exports = function rmdir (_path, cb) {
  cb = cb || function () {};

  function _rmdir (p, next) {
    fs.readdir(p, function (err, files) {
      if (err) return next(err);
      function iterator (err) {
        if (err) return next(err);
        var file = files.shift();
        if (!file) return fs.rmdir(p, next);
        file = path.join(p, file);
        fs.stat(file, function (err, stat) {
          if (err) return next(err);
          if (stat.isDirectory())
            _rmdir(file, iterator);
          else if (stat.isFile())
            fs.unlink(file, iterator);
        });
      }
      iterator();
    });
  }

  _rmdir(_path, function (err) {
    if (err) return cb(err);
    cb(null);
  });
};
