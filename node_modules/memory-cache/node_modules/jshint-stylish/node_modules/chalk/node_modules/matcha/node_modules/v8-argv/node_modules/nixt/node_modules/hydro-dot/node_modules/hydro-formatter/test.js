var Formatter = require('./');
var chai = require('chai');
var assert = require('assert');

chai.Assertion.includeStack = true;

function Test(title, error){
  this.title = title;
  this.error = error;
  this.time = 1;
}

Test.prototype.fullTitle = function(){
  return this.title;
};

// failures, passing, pending

var all = new Formatter;

var chaiErr = null;
var assertErr = null;
var errnoStack = new Error('look ma, no stack');
errnoStack.showStack = false;

try {
  chai.expect({ foo: 'bar' }).to.eq(['1', 'b']);
} catch (e) {
  chaiErr = e;
}

try {
  assert(1 === 2, 'oops');
} catch (e) {
  assertErr = e;
}

all.failed = [
  new Test('chai error', chaiErr),
  new Test('assert error', assertErr),
  new Test('no stack', errnoStack)
];

all.skipped = [ new Test ];
all.pending = [ new Test ];

all.tests = [ new Test ]
  .concat(all.pending)
  .concat(all.skipped)
  .concat(all.failed);

all.displayResult();
all.displayFailed();

all.hydro = { get: function(){return false} }

// should hide stack

console.log();
all.displayFailed();

// passing tests

var passing = new Formatter;
passing.tests = [ new Test, new Test, new Test, new Test ];
passing.displayResult();
passing.displayFailed();

// 0 tests

var none = new Formatter;
none.tests = [];
none.displayResult();
none.displayFailed();
