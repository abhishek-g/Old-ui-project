[![NPM
version](https://badge.fury.io/js/hydro-bdd.png)](http://badge.fury.io/js/hydro-bdd)
[![Build Status](https://secure.travis-ci.org/hydrojs/hydro-bdd.png)](http://travis-ci.org/hydrojs/hydro-bdd)
[![Coverage Status](https://coveralls.io/repos/hydrojs/hydro-bdd/badge.png?branch=master)](https://coveralls.io/r/hydrojs/hydro-bdd?branch=master)

# hydro-bdd

## Synopsis

BDD interface for [hydro](https://github.com/hydrojs/hydro)

```js
describe('hydro-bdd', function() {
  context('working', function() {
    when('works for real', function() {
      it('really works', function() {

      });
    });
  });
});
```

## Usage

```js
hydro.set({
  plugins: ['hydro-bdd'],
});
```

## Installation

#### npm:

```bash
npm install hydro-bdd
```

#### component:

```bash
component install hydrojs/hydro-bdd
```

#### standalone:

```bash
<script src="hydro-bdd"></script>
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
