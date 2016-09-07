// Perform task in future turn of event loop.

'use strict';

var global = require('es5-ext/global');

module.exports = (global.process && process.nextTick) || function (f) {
	setTimeout(f, 0);
};
