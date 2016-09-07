'use strict';

var resolve   = require('path').resolve
  , normalize = require('xlint-jslint/normalize');

module.exports = normalize(resolve(__dirname, 'jslint.js'));
