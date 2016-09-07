if (typeof window === 'undefined') {
  require('./support/');
}

test('objects', function() {
  var obj = {};
  assert(loa(obj) === obj);
});

test('functions', function() {
  var fn = function Foo(){}
  var actual = loa(fn);
  assert(actual.name === 'Foo');
});

test('global', function() {
  foo = 42;
  assert(loa('foo') === foo);
  foo = null;
});

test('require', function() {
  assert(loa('chai') === require('chai'));
});

test('throws', function() {
  assert.throw(function() {
    loa(undefined);
  });

  assert.throw(function() {
    loa(NaN);
  });

  assert.throw(function() {
    loa(null);
  });
});
