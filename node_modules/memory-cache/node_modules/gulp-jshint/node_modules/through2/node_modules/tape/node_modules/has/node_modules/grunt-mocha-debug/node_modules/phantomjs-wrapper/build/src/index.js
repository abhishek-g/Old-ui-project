(function() {
  var EventEmitter, Page, PhantomJS, fs, http, instances, linestream, main, p, path, phantomBin, phantomjs, shared, spawn,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  path = require('path');

  http = require('http');

  fs = require('fs');

  require('coffee-script');

  spawn = require('child_process').spawn;

  EventEmitter = require('events').EventEmitter;

  linestream = require('line-stream');

  shared = require('./shared');

  p = __dirname;

  while (!fs.existsSync(path.join(p, 'package.json'))) {
    p = path.dirname(p);
  }

  phantomBin = path.join(p, 'node_modules/phantomjs/bin/phantomjs');

  main = path.join(p, 'phantomjs/main.coffee');

  instances = [];

  process.on('exit', function() {
    var instance, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = instances.length; _i < _len; _i++) {
      instance = instances[_i];
      _results.push(instance.close(function() {}));
    }
    return _results;
  });

  PhantomJS = (function(_super) {
    __extends(PhantomJS, _super);

    function PhantomJS(child) {
      this.child = child;
      instances.push(this);
      this.pages = {};
      this.port = null;
      this.closed = false;
    }

    PhantomJS.prototype.createPage = function(cb) {
      var createCb,
        _this = this;
      if (this.closed) {
        throw new Error('phantomjs instance already closed');
      }
      createCb = function(msg) {
        var rv;
        rv = _this.pages[msg.pageId] = new Page(msg.pageId, _this);
        return cb(null, rv);
      };
      return this.send({
        type: 'createPage'
      }, createCb);
    };

    PhantomJS.prototype.send = function(msg, cb) {
      var data, json, opts, req, url,
        _this = this;
      data = JSON.stringify(msg);
      json = '';
      url = "http://" + this.address;
      opts = {
        hostname: '127.0.0.1',
        port: this.port,
        path: '/',
        method: 'POST',
        headers: {
          'Content-Length': data.length,
          'Content-Type': 'application/json'
        }
      };
      req = http.request(opts, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(data) {
          return json += data;
        });
        return res.on('end', function() {
          return cb(JSON.parse(json));
        });
      });
      req.on('error', function(e) {
        if (e.message.match(/ECONNREFUSED|ECONNRESET/)) {
          return;
        }
        throw e;
      });
      return req.end(data, 'utf8');
    };

    PhantomJS.prototype.receive = function(data) {
      var event, msg, page;
      msg = JSON.parse(data);
      if (msg.type === 'phantomTimeout') {
        return this.close(function() {});
      }
      page = this.pages[msg.pageId];
      event = msg.event.slice(2);
      event = event.charAt(0).toLowerCase() + event.slice(1);
      if (event === 'error') {
        msg.args[0] = new Error(msg.args[0]);
      }
      return page.emit.apply(page, [event].concat(__slice.call(msg.args)));
    };

    PhantomJS.prototype.close = function(cb) {
      var idx;
      this.closed = true;
      this.emit('closed');
      this.child.on('close', cb);
      this.child.kill('SIGTERM');
      idx = instances.indexOf(this);
      return instances.splice(idx, 1);
    };

    return PhantomJS;

  })(EventEmitter);

  Page = (function(_super) {
    var method, _fn, _i, _len, _ref,
      _this = this;

    __extends(Page, _super);

    function Page(id, phantomjs) {
      this.id = id;
      this.phantomjs = phantomjs;
    }

    _ref = shared.methods.concat(shared.asyncMethods);
    _fn = function(method) {
      return Page.prototype[method] = function() {
        var args, callback, cb;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        cb = null;
        callback = function(msg) {
          if (cb) {
            return cb.apply(null, msg.args);
          }
        };
        if (typeof args[args.length - 1] === 'function') {
          cb = args.pop();
        }
        if (this.closed) {
          throw new Error('page already closed');
        }
        if (method === 'close') {
          this.closed = true;
        }
        return this.phantomjs.send({
          type: 'pageMessage',
          pageId: this.id,
          pageMessageType: 'callMethod',
          name: method,
          args: args
        }, callback);
      };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      method = _ref[_i];
      _fn(method);
    }

    Page.prototype.get = function(name, cb) {
      var callback;
      callback = function(msg) {
        return cb.apply(null, msg.args);
      };
      return this.phantomjs.send({
        type: 'pageMessage',
        pageId: this.id,
        pageMessageType: 'getProperty',
        name: name
      }, callback);
    };

    Page.prototype.set = function(name, val, cb) {
      var callback;
      callback = function(msg) {
        if (typeof cb === 'function') {
          return cb.apply(null, msg.args);
        }
      };
      return this.phantomjs.send({
        type: 'pageMessage',
        pageId: this.id,
        pageMessageType: 'setProperty',
        val: val,
        name: name
      }, callback);
    };

    return Page;

  }).call(this, EventEmitter);

  phantomjs = function(options, cb) {
    var args, binPath, child, debug, instance, ls, opts, ready, stdout, timeout;
    timeout = 20000;
    debug = false;
    binPath = phantomBin;
    if (options) {
      if (typeof options === 'function') {
        cb = option;
      } else {
        if (options.timeout) {
          timeout = options.timeout;
        }
        if (options.binPath) {
          binPath = options.binPath;
        }
        debug = options.debug;
      }
    }
    options = JSON.stringify({
      timeout: timeout,
      debug: debug
    });
    args = [main];
    stdout = 'ignore';
    if (debug) {
      stdout = process.stdout;
    }
    opts = {
      stdio: ['pipe', stdout, 'pipe']
    };
    child = spawn(binPath, args, opts);
    child.stdin.write("" + options + "\n", 'utf8');
    instance = new PhantomJS(child);
    ready = false;
    ls = linestream();
    child.stderr.pipe(ls);
    ls.on('data', function(data) {
      if (!instance.port) {
        instance.port = data;
        return cb(null, instance);
      }
      return instance.receive(data);
    });
    return child.on('error', function(err) {
      if (!ready) {
        ready = true;
        return cb(err);
      }
      throw err;
    });
  };

  module.exports = phantomjs;

}).call(this);


//@ sourceMappingURL=index.js.map