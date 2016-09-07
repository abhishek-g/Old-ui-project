var root = null;

if (typeof window === 'undefined') {
  root = global;
  root.loa = require('../../');
} else {
  root = window;
  root.loa = require('loa');
  root.__karma__.start = function() {
    root.__karma__.info({ total: 1 });
    root.__karma__.result({ success: true });
    root.__karma__.complete();
  };
}

root.assert = function(expr, msg) {
  if (expr) return;
  throw Error(msg || 'Assertion failed');
};

root.assert.throw = function(fn) {
  var err = null;
  try { fn() }
  catch (e) { err = e };
  root.assert(err);
};

root.test = function(str, fn) {
  fn();
};
