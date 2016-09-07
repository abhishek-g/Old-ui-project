var EventEmitter = require('events').EventEmitter
  , util = require('util')
  , fs = require('fs')
  , path = require('path')
  , exists = fs.existsSync || path.existsSync;

module.exports = function (src) {
  var watcher = new Watcher();
  watcher.watch(src);
  return watcher;
};

function Watcher (src) {
  EventEmitter.call(this);
  this._watchers = {};
}

util.inherits(Watcher, EventEmitter);

Watcher.prototype.watch = function (src) {
  var self = this
    , stat = fs.statSync(src)
    , type;

  if (stat.isDirectory()) {
    type = 'directory';
    var dirFiles = fs.readdirSync(src);
    for (var di = 0; di < dirFiles.length; di++) {
      var dirFile = path.join(src, dirFiles[di]);
      self.watch(dirFile);
    }
  } else if (stat.isFile())  {
    type = 'file';
  }

  var watch = fs.watch(src, function (ev, _file) {
    if (!exists(src)) {
      self.unwatch(src);
      self.emit('delete', src);
    } else {
      var stats;
      try {
        stats = fs.statSync(src);
      } catch (ex) {
        if (ex.code == 'ENOENT' && self.has(src)) {
          self.unwatch(src);
          self.emit('delete', src);
        }
        return;
      }
      if (stats.isFile()) {
        self.emit('change', src, stats);
      } else if (stats.isDirectory()) {
        // if this is a new directory
        if (!self.has(src))
          self.emit('create', src, stats);

        // get list of files we are already watching
        // in this directory
        var existing = Object.keys(self._watchers)
          .filter(function (f) {
            var type = self._watchers[f].type;
            return src === path.dirname(f)
              && type === 'file';
          });

        // get a list of files in the directory
        var files = fs.readdirSync(src)
          .map(function (f) {
            return path.join(src, f);
          });

        // handle created
        files
          .filter(function (f) {
            return !self.has(f);
          })
          .forEach(function (f) {
            self.emit('create', f, fs.statSync(f));
            self.watch(f);
          });

        // handle deleted
        existing
          .filter(function (f) {
            return !~files.indexOf(f);
          })
          .forEach(function (f) {
            self.emit('delete', f);
            self.unwatch(f);
          });
      }
    }
  });

  this._watchers[src] = {
      type: type
    , watch: watch
  };

  this.emit('watch', src);
};

Watcher.prototype.has = function (src) {
  return ('undefined' !== typeof this._watchers[src])
    ? true
    : false;
}

Watcher.prototype.unwatch = function (src) {
  if (this.has(src)) {
    this._watchers[src].watch.close();
    delete this._watchers[src];
  }
  this.emit('unwatch', src);
};

Watcher.prototype.clear = function () {
  for (var src in this._watchers) {
    this.unwatch(src);
  };
};
