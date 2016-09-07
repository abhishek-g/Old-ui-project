[![NPM
version](https://badge.fury.io/js/hydro-chai.png)](http://badge.fury.io/js/hydro-chai)
[![Build Status](https://secure.travis-ci.org/hydrojs/hydro-chai.png)](http://travis-ci.org/hydrojs/hydro-chai)

# hydro-chai

## Synopsis

Chai.js integration for [hydro](https://github.com/hydrojs/hydro)

## Usage

```js
hydro.set({
  attach: global,
  plugins: ['hydro-chai'],
  chai: {
    plugins: ['chai-spies'],
    styles: ['expect', 'assert', 'should'], // desired styles
    diff: true, // show diff
    stack: true // include stack
  },
});
```
## Installation

npm:

```bash
npm install hydro-chai
```

component:

```bash
component install hydrojs/hydro-chai
```

## Tests

```bash
$ npm test
```

Coverage:

```bash
$ npm run coverage
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
