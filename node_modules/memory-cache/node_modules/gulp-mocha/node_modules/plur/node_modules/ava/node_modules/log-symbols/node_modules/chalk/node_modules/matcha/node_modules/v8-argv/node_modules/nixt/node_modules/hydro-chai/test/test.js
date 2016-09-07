test('global', function() {
  sassert(chai);
});

test('styles', function() {
  sassert(should);
  sassert(expect);
  sassert(assert);
});

test('stack', function() {
  sassert(chai.config.includeStack);
});

test('showDiff', function() {
  sassert(chai.config.showDiff);
});

test('plugins', function() {
  sassert(chai.spy);
});

test('should', function() {
  should.not.exist(null);
});
