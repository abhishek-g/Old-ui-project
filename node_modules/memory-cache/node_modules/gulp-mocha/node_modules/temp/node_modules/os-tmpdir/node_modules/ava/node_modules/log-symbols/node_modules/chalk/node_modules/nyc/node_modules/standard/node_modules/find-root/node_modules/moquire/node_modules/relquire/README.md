# relquire
yes, it's another wrapper for node's require*

require modules relative to your project's root directory.

## installation

    $ npm install relquire

## usage

    var relquire = require('relquire')

    var foo = relquire('~/path/from/package/root')

    foo()

## api

### `relquire(id)`, `relquire(id, baseDir)`
Requires the module relative to the `baseDir` directory. If `baseDir` is not specified, defaults to the package root of the module requiring `relquire`.

### `relquire.findBase(dir)`
Finds the closest package.json-containing directory (package root).

### `relquire.resolve(id)`, `resolquire(id, baseDir)
Resolves a file path relative to the `baseDir` directory. If `baseDir` is not specified, defaults to the package root of the module requiring `relquire`.


## running the tests

From package root:

    $ npm install
    $ npm test

## contributors

jden <jason@denizac.org>

## license

MIT. (c) 2013 Agile Diagnosis <hello@agilediagnosis.com>. See LICENSE.md


*aren't you glad I didn't call it reliquary like I was going to?