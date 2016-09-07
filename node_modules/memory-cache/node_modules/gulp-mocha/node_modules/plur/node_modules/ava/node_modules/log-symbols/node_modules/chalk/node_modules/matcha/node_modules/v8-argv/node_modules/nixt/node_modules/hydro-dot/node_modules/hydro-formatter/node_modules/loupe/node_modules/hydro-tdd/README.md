[![NPM
version](https://badge.fury.io/js/hydro-tdd.png)](http://badge.fury.io/js/hydro-tdd)
[![Build Status](https://secure.travis-ci.org/hydrojs/hydro-tdd.png)](http://travis-ci.org/hydrojs/hydro-tdd)
[![Coverage Status](https://coveralls.io/repos/hydrojs/hydro-tdd/badge.png?branch=master)](https://coveralls.io/r/hydrojs/hydro-tdd?branch=master)

# hydro-tdd

## Synopsis

TDD interface for [hydro](https://github.com/hydrojs/hydro)

```js
suite('My module', function() {
  test('it really works', function() {

  });
});
```

## Usage

```js
hydro.set({
  plugins: ['hydro-tdd'],
});
```

## Installation

#### npm:

```bash
npm install hydro-tdd
```

#### component:

```bash
component install hydrojs/hydro-tdd
```

#### standalone:

```bash
<script src="hydro-tdd"></script>
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

The MIT License (see LICENSE)
