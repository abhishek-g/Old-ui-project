"use strict";

var path = require("path");
var fs = require("fs");
var rmrf = require("rimraf");
var MODULE_ROOT = path.resolve(__dirname, "..");
var FIXTURES_ROOT = path.join(path.resolve(MODULE_ROOT), "test/.fixtures");

module.exports = {
    FIXTURES_ROOT: FIXTURES_ROOT,

    clearFixtures: function (done) {
        rmrf(FIXTURES_ROOT, done(function (err) {
        }));
    }
};