"use strict";
/*jshint maxlen:90 */

var th = require("./test-helper");
var path = require("path");
var fs = require("fs");
var cli = require("../lib/buster-static");

var buster = require("buster");
var assert = buster.assert;
var refute = buster.refute;

var outputPath = path.join(th.FIXTURES_ROOT, "tmp/static-test");

var NOOP = function (msg) { };

buster.testCase("file writer", {

    setUp: function (done) {
        
        var self = this;
        this.s = cli.create();
        this.s.logger = { log: NOOP, error: NOOP };
        this.s.run(["--config",
                    __dirname + "/fixtures/test-config.js",
                    outputPath]);
        
        var oldWriteToDisk = this.s.writeToDisk;
        this.s.writeToDisk = function () {
            oldWriteToDisk.apply(self.s, arguments).then(done)
        };
    },

    tearDown: function (done) {
        th.clearFixtures(done);
    },
    
    "create output folder": function (done) {
        fs.exists(outputPath, done(function (exists) {
            assert(exists);
        }));
    },
    
    "write index file": function (done) {
        fs.exists(outputPath + "/index.html", done(function (exists) {
            assert(exists);
        }));
    },
    
    "append javascript files to index file": {
        
        "some-test.js": function (done) {
            fs.readFile(outputPath + "/index.html", done(function (err, data) {
                assert.match(data, '<script src="./some-test.js">');
            }));
        },
        
        "buster/browser-run.js": function (done) {
            fs.readFile(outputPath + "/index.html", done(function (err, data) {
                assert.match(data, '<script src="./buster/browser-run.js">');
            }));
        },

        "buster/buster-0.7.x.js": function (done) {
            fs.readFile(outputPath + "/index.html", done(function (err, data) {
                assert.match(data, '<script src="./buster/buster-0.7.x.js">');
            }));
        }
    },
    
    "write load resources": {
        
        "some-test.js": function (done) {
            fs.exists(outputPath + "/some-test.js", done(function (exists) {
                assert(exists);
            }));
        },
        
        "buster/browser-run.js": function (done) {
            fs.exists(outputPath + "/buster/browser-run.js", done(function (exists) {
                assert(exists);
            }));
        },
        
        "buster/buster-0.7.x.js": function (done) {
            fs.exists(outputPath + "/buster/buster-0.7.x.js", done(function (exists) {
                assert(exists);
            }));
        }
    },
    
    "write css files": {
        
        "buster-test.css": function (done) {
            fs.exists(outputPath + "/buster-test.css", done(function (exists) {
                assert(exists);
            }));
        },
        
        "buster-0.7.x.css": function (done) {
            fs.exists(outputPath + "/buster/buster-0.7.x.css", done(function (exists) {
                assert(exists);
            }));
        }
    }

});
