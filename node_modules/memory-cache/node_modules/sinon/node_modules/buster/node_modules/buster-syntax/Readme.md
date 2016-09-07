# buster-syntax

[![Build status](https://secure.travis-ci.org/busterjs/buster-syntax.png?branch=master)](http://travis-ci.org/busterjs/buster-syntax)

> Stop syntax errors before they hit the browser

`buster-syntax` is an API for syntax checking JavaScript in Node.JS. It also
provides a Buster.JS extension that syntax checks files on the server before
running them in the browser (over `ramp`).

Catching errors early with Buster.JS test runs has one primary goal: Avoid
browsers with poor error handling freezing if a test run contains lots of
errors. As a pleasant side-effect, you get consistent and detailed syntax
errors, regardless of target browser.

This extension ships with Buster.JS by default, so there's nothing to do to
enable it. If you want to do test runs in the browser without this extension,
you have to provide your own runner plumbing, see `buster docs
<http://github.com/busterjs/buster/>`_ for information on how.


## API Docs

To syntax check some JavaScript, require the module and call its `check`
method. It returns an object with details about the validity.


### `check(script[, file])`

Syntax check the code with the optional file name. The file name is used to
create nice error messages.

```javascript
var syntax = require("buster-syntax").syntax;

// Syntactically valid
syntax.check("var a = 42;"); // => { ok: true }

// Syntactically invalid
syntax.check("var a 42;"); // => {
  ok: false,
  errors:
    [ { file: null,
        type: 'Syntax error',
        message: 'Unexpected token: num (42)',
        line: 1,
        col: 7,
        content: 'var a 42;' } ] }


// Syntactically invalid, with file name
syntax.check("var a 42;", "life.js"); // => {
  ok: false,
  errors:
    [ { file: "life.js",
        type: 'Syntax error',
        message: 'Unexpected token: num (42)',
        line: 1,
        col: 7,
        content: 'var a 42;' } ] }
```        


### `configure(options)`

Configures the syntax checker and returns a specialized instance (i.e., it does
not change the module instance). Currently only one configuration property is
supported: `ignoreReferenceErrors`. References typically require more than one
file to be viewed as one unit. If you just want to syntax check one file that
contains references to external identifiers, you can choose to not fail on those
unknown references.

```javascript
var syntax = require("buster-syntax").syntax;

syntax.check("$('li').on('click', function() {})"); // => {
  ok: false,
  errors:
    [ { file: null,
        type: 'Syntax error',
        message: 'Unexpected token punc, expected punc',
        line: 1,
        col: 30,
        content: '$(\'li\').on(\'click\', function {})' } ] }

var checker = syntax.configure({ ignoreReferenceErrors: true });
checker.check("$('li').on('click', function() {})"); // => { ok: true }
```


## Changelog

**0.4.3** (06.06.2014)

* JsDom updated to version ~0.10 for issue [#410 - Buster is modifying the global `Error` object (via old JSDOM)](https://github.com/busterjs/buster/issues/410)
