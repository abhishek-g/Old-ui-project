'use strict';

var compact    = require('es5-ext/array/#/compact')
  , readFile   = require('fs').readFileSync
  , resolve    = require('path').resolve
  , vm         = require('vm')

  , reduce = Array.prototype.reduce, compare;

compare = function (a, b) {
	return (a.line - b.line) || (a.character - b.character);
};

module.exports = function (path) {
	var ctx = vm.createContext({}), linter, result;
	path = resolve(String(path));
	vm.runInContext(readFile(path), ctx, path);
	linter = ctx.JSLINT;
	if (!linter) throw new Error("Module not recognized as JSLint file");
	result = function (src, options) {
		return linter(src, options) ? [] : compact.call(
			linter.errors.map(function (raw) {
				var error;
				if (raw == null) return null;
				if (!raw.raw) {
					if (!raw.reason) throw new Error("Could not parse raw data");
					return { line: 0, character: 0,
						message: 'Linter error: ' + raw.reason };
				}
				error = { line: raw.line, character: raw.character };
				error.message = reduce.call('abcd', function (msg, token) {
					return (raw[token] != null) ?
							msg.replace('{' + token + '}', raw[token]) : msg;
				}, raw.raw);
				return error;
			})
		).sort(compare);
	};
	result.xlintId = 'jslint';
	return result;
};
