[![NPM
version](https://badge.fury.io/js/fload.png)](http://badge.fury.io/js/fload)
[![Build Status](https://secure.travis-ci.org/vesln/fload.png)](http://travis-ci.org/vesln/fload)
[![Coverage Status](https://coveralls.io/repos/vesln/fload/badge.png?branch=master)](https://coveralls.io/r/vesln/fload?branch=master)
[![Code Climate](https://codeclimate.com/github/vesln/fload.png)](https://codeclimate.com/github/vesln/fload)

# fload

JavaScript file loader for browsers and Node.js

## Usage

```js
var fload = require('fload');

fload(['dir', 'glob/*.js', 'another-dir'], {
  pre: function(file, done) {
    // before loading `file`
    done();
  },

  post: function(file, contents, done) {
    // after loading `file`, now we've got the exported objects
    // however, when used in the browser, we don't have it :(
    done();
  },

  done: function() {
    // all files loaded
  }
});
```

_Node.js: You can use glob patterns and directories_

## Installation

npm:

```bash
npm install fload
```

component:

```bash
component install vesln/fload
```

## Tests

### Running the tests

### All:

```bash
$ make test
```

### Node:

```bash
$ make test-node
```

### Browser:

```bash
$ make test-browser
```

### Test coverage

```bash
$ make coverage
```

## License

(The MIT License)

Copyright (c) 2013 Veselin Todorov <hi@vesln.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
