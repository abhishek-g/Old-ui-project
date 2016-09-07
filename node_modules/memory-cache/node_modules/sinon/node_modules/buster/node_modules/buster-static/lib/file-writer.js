"use strict";

var rampResources = require("ramp-resources");

var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var async = require("async");
var when = require("when");


function createOutputFolder(cb) {
    
    mkdirp(this.outputFolder, "0755", function (err) {
        if (err) {
            this.logger.error(err);
        }
        cb(err);
    });
}

function writeIndexFile(cb) {

    var self = this;
    this.resourceSet.get("/").content().then(function (indexContent) {
        indexContent = rampResources.prepareResource(
            ".",
            { resourceSet: self.resourceSet, mountPoint: "" },
            self.resourceSet.get("/"),
            indexContent
        );
        fs.writeFile(self.outputFolder + "/index.html", indexContent, cb);
    });
}

function writeLoadResources(cb) {

    if (this.resourceSet.loadPath.paths().length === 0) {
        cb();
    } else {
        var load = this.resourceSet.loadPath.paths().shift();
        var fullPath = path.join(this.outputFolder, load);
        var self = this;
        mkdirp(path.dirname(fullPath), function (err) {
            if (err) {
                cb(err);
            } else {
                var resource = self.resourceSet.get(load);
                self.resourceSet.remove(load);
                resource.content().then(function (content) {
                    fs.writeFile(fullPath, content, function (err) {
                        if (err) {
                            cb(err);
                        } else {
                            writeLoadResources.call(self, cb);
                        }
                    });
                });
            }
        });
    }
}

function writeCssFiles(cb) {
    
    var self = this;
    
    async.parallel(
        {
            "buster-test.css": function (cb) {
                var cssPath = path.resolve(
                    require.resolve("buster-test/resources/buster-test.css"));
                fs.writeFile(self.outputFolder + "/buster-test.css",
                    fs.readFileSync(cssPath), cb);
            },
            
            "buster-test2.css": function (cb) {
                var cssPath = path.resolve(
                    require.resolve("buster-test/resources/buster-test2.css"));
                fs.writeFile(self.outputFolder + "/buster/buster-0.7.x.css",
                    fs.readFileSync(cssPath), cb);
            }
        },

        function (err, results) {
            cb(err);
        }
    );
}

function writeFiles() {

    var self = this;
    var d = when.defer();

    async.series(
        [
            createOutputFolder.bind(this),
            writeIndexFile.bind(this),
            writeLoadResources.bind(this),
            writeCssFiles.bind(this)
        ],

        function (err, results) {
            if (err) {
                self.logger.error(err);
                d.reject();
            } else {
                self.logger.log("Files written to '" + self.outputFolder + "'");
                self.logger.log("To run tests, open this file in a browser:");
                self.logger.log(" file://" + self.outputFolder + "/index.html");
                d.resolve();
            }
        }
    );

    return d.promise;
}

/**
 * This module is responsible for writing the files, needed for the QUnit style
 * static browser test execution, to disk.
 *
 * usage: fileWriter.create(outputFolder, resourceSet, logger).writeFiles()
 */
module.exports = {

    /**
     * Creates an instance of file-writer.
     *
     * @param outputFolder {string} Folder in which the files are to be written.
     * @param resourceSet {ramp-resource/lib/resource-set} All resources from
     *     the load path are written to disk and added to the <code>index.html</code>.
     * @param logger {stream-logger/lib/stream-logger}
     */
    create: function (outputFolder, resourceSet, logger) {
        
        var instance = Object.create(this);
        instance.outputFolder = path.resolve(outputFolder);
        instance.logger = logger;
        instance.resourceSet = resourceSet;
        
        instance.writeFiles = writeFiles;

        return instance;
    }

};
