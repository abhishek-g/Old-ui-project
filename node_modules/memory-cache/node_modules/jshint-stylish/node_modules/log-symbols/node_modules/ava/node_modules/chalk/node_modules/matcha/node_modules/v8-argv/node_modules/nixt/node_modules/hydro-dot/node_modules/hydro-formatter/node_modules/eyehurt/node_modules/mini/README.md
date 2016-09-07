[![Build Status](https://secure.travis-ci.org/vesln/mini.png)](http://travis-ci.org/vesln/mini)

# mini

Minimalistic test runner for Node.js

## Usage

```js
// test/my-test.js

test('Sync test', function() {
  // do sync stuff
});

test('Async test', function(done) {
  // do async stuff
  done();
});
```

Then:

```
$ mini
```

## Installation

```bash
npm install mini
```

## License

MIT
