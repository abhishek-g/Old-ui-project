# xlint-jslint-medikoo
## JSLint mod handler for XLint

Use this module with XLint.

It's customized version of JSLint that I use to validate code in projects I mantain.

In first place __it provides `module` option to validate body of CJS modules as an actual function bodies__. JSLint by defaults treats file code as if it's browser's script code, it's not right when we validate CJS modules.

Additionally: it removes few non configurable restrictions and adds more strict whitespace rules with some extra customizations.  

All custom changes are documented distintingly in [commit history](https://github.com/medikoo/xlint-jslint-medikoo/commits/master/jslint.js).

It's maintained to be up to date with original [JSLint](https://github.com/douglascrockford/JSLint).

For non customized JSLint validation module for XLint, see: [xlint-jslint](https://github.com/medikoo/xlint-jslint)

## Installation

	$ npm install xlint-jslint-medikoo

## Tests [![Build Status](https://travis-ci.org/medikoo/xlint-jslint-medikoo.png)](https://travis-ci.org/medikoo/xlint-jslint-medikoo)

	$ npm test
