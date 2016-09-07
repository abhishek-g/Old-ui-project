suite('foo', function() {
  test('bar', function() {
    assert(__hydro.runner.suites.length === 1);
    assert(__hydro.runner.suites[0].tests.length === 1);
  });
});
