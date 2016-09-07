'use strict';

var resolve   = require('path').resolve
  , normalize = require('./normalize');

module.exports = normalize(resolve(__dirname, 'jslint/jslint.js'));
