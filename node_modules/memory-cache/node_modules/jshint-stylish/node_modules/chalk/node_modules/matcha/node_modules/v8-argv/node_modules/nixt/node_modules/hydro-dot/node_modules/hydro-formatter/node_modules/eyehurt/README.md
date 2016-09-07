[![NPM
version](https://badge.fury.io/js/eyehurt.png)](http://badge.fury.io/js/eyehurt)
[![Build Status](https://secure.travis-ci.org/vesln/eyehurt.png)](http://travis-ci.org/vesln/eyehurt)
[![Coverage Status](https://coveralls.io/repos/vesln/eyehurt/badge.png?branch=master)](https://coveralls.io/r/vesln/eyehurt?branch=master)
[![Code Climate](https://codeclimate.com/github/vesln/eyehurt.png)](https://codeclimate.com/github/vesln/eyehurt)

# eyehurt

## Synopsis

Color utility for zombies.

Extracted out of [Quantum](https://github.com/qualiancy/quantum)

## Usage

```js
var color = require('./');

color('str', 'red'); // => "\u001b[31mstr\u001b[0m"

color('str', 'red', { enable: false }); // => "str"

color('[Today](red) is [great](blue)', { parse: true }); // => "\u001b[31mToday\u001b[0m is \u001b[34mgreat\u001b[0m"

color('[str](red)', { parse: true, enable: false }); // => "str"
```

## Installation

```bash
npm install eyehurt
```

## Tests

### Running the tests

```bash
$ npm test
```

### Test coverage

```bash
$ npm run coverage
```

## License

MIT License

Copyright (C) 2012-2013 Jake Luer <jake@qualiancy.com>

Copyright (C) 2013 Veselin Todorov (hi@vesln.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
