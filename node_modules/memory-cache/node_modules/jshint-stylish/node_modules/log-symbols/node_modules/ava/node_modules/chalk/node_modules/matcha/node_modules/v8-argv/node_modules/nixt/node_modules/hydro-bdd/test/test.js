describe('foo', function() {
  var hooks = {
    beforeAll: 0,
    before: 0,
    beforeNext: 0,
    after: 0,
  };

  beforeAll(function() {
    hooks.beforeAll++;
  });

  before(function() {
    hooks.before++;
  });

  before(function(done) {
    setTimeout(function() {
      hooks.before++;
      done();
    }, 1);
  });

  context('context', function() {
    after(function() {
      hooks.after++;
    });

    after(function(done) {
      setTimeout(function() {
        hooks.after++;
        done();
      }, 1);
    });

    context('context 2', function() {
      beforeNext(function() {
        hooks.beforeNext++;
      });

      it('before', function() {
        var suites = __hydro.suites();

        assert(suites.length === 4, 'bad length: ' + suites.length);
        assert(suites[3].tests.length === 2);

        assert(hooks.before === 2);
        assert(hooks.beforeAll === 1);
        assert(hooks.beforeNext === 1);
      });

      it('after', function() {
        assert(hooks.after === 2);
        assert(hooks.before === 4);
        assert(hooks.beforeAll === 1);
        assert(hooks.beforeNext === 1);
      });
    });
  });
});
