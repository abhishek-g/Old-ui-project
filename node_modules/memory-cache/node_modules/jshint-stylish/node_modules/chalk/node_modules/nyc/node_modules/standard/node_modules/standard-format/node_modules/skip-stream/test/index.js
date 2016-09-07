
var assert = require('better-assert');
var through = require('through');
var from = require('from');
var skip = require('../');
var reduce = require('stream-reduce');

var consume = function() {
  return reduce(function(acc, item){
    acc.push(item);
    return acc;
  }, []);
};

describe('skip-stream', function(){
  it('skips 0 elements', function(done){
    from([1,2])
    .pipe(skip(0))
    .pipe(consume())
    .pipe(through(function(data){
      assert(data[0] === 1);
      assert(data[1] === 2);
    }, done));
  });

  it('skips 1 element', function(done){
    from([1,2,3])
    .pipe(skip(1))
    .pipe(consume())
    .pipe(through(function(items){
      assert(items[0] === 2);
      assert(items[1] === 3);
    }, done));
  });

  it('skips all elements', function(done){
    from([1,2,3])
    .pipe(skip(3))
    .pipe(consume())
    .pipe(through(function(items){
      assert(items.length === 0);
    }, done));
  });

  it('skips more than all elements', function(done){
    from([1,2,3])
    .pipe(skip(4))
    .pipe(consume())
    .pipe(through(function(items){
      assert(items.length === 0);
    }, done));
  });

  it('skips nothing in an empty list', function(done){
    from([])
    .pipe(skip(1))
    .pipe(consume())
    .pipe(through(function(items){
      assert(items.length === 0);
    }, done));
  });

});
