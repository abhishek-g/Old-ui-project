var sinon = require("sinon");
var testCase = require("buster-test").testCase;
var referee = require("referee");
var assert = referee.assert;
var refute = referee.refute;
var syntax = require("../lib/buster-syntax");
var bc = require("buster-configuration");
var ba = require("buster-analyzer");

function process(group, then, errBack) {
    group.resolve().then(function (resourceSet) {
        resourceSet.serialize().then(then, errBack);
    }, errBack);
}

testCase("Syntax extension", {
    setUp: function () {
        this.config = bc.createConfiguration();
        this.analyzer = ba.createAnalyzer();
        this.listeners = { fatal: sinon.spy(), error: sinon.spy() };
        this.analyzer.on("fatal", this.listeners.fatal);
        this.analyzer.on("error", this.listeners.error);
    },

    "flags fatal on syntax error": function (done) {
        var group = this.config.addGroup("Some tests", {
            resources: [{ path: "/buster.js", content: "va a = 42;" }],
            sources: ["/buster.js"]
        });

        var ext = syntax.create();
        ext.analyze(this.analyzer);
        ext.configure(group);

        process(group, done(function (resource) {
            assert(this.listeners.fatal.calledOnce);
            assert(this.listeners.fatal.calledWith("Syntax error"));
        }.bind(this)), console.log);
    },

    "flags error on reference error": function (done) {
        var group = this.config.addGroup("Some tests", {
            resources: [{ path: "/buster.js", content: "var a = $('div');" }],
            sources: ["/buster.js"]
        });

        var ext = syntax.create();
        ext.analyze(this.analyzer);
        ext.configure(group);

        process(group, done(function (resource) {
            assert(this.listeners.error.calledOnce);
            assert(this.listeners.error.calledWith("ReferenceError"));
        }.bind(this)));
    },

    "skips reference error if configured thusly": function (done) {
        var group = this.config.addGroup("Some tests", {
            resources: [{ path: "/buster.js", content: "var a = $('div');" }],
            sources: ["/buster.js"]
        });

        var ext = syntax.create({ ignoreReferenceErrors: true });
        ext.analyze(this.analyzer);
        ext.configure(group);

        process(group, done(function (resource) {
            refute(this.listeners.error.called);
        }.bind(this)));
    },

    "flags fatal on all user sources": function (done) {
        var group = this.config.addGroup("Some tests", {
            resources: [
                { path: "/buster.js", content: "va a = 42;" },
                { path: "/buster2.js", content: "va a = 42;" },
                { path: "/buster3.js", content: "va a = 42;" },
                { path: "/buster4.js", content: "va a = 42;" }
            ],
            libs: ["/buster.js"],
            sources: ["/buster.js"],
            testHelpers: ["/buster.js"],
            tests: ["/buster.js"]
        });

        var ext = syntax.create();
        ext.analyze(this.analyzer);
        ext.configure(group);

        process(group, done(function (resource) {
            assert.equals(this.listeners.fatal.callCount, 4);
        }.bind(this)), console.log);
    },

    "does not syntax-check non-javascript resources": function (done) {
        var group = this.config.addGroup("Some tests", {
            resources: [{ path: "/buster", content: "va a = 42;" }],
            libs: ["/buster"]
        });

        var ext = syntax.create();
        ext.analyze(this.analyzer);
        ext.configure(group);

        process(group, done(function (resource) {
            refute(this.listeners.fatal.called);
        }.bind(this)), console.log);
    },

    "does not fail file ending in comment": function (done) {
        var group = this.config.addGroup("Some tests", {
            resources: [{ path: "/some.js", content: "// var a = 42;" }],
            libs: ["/some.js"]
        });

        var ext = syntax.create();
        ext.analyze(this.analyzer);
        ext.configure(group);

        process(group, done(function (resource) {
            refute(this.listeners.fatal.called);
        }.bind(this)), console.log);
    },

    "renders resource uncacheable with fatal error": function (done) {
        var group = this.config.addGroup("Some tests", {
            resources: [{ path: "/some.js", content: "va a = 42;" }],
            sources: ["/some.js"]
        });

        var ext = syntax.create();
        ext.analyze(this.analyzer);
        ext.configure(group);

        process(group, done(function (rs) {
            assert.isFalse(rs.resources[0].cacheable);
        }));
    },

    "renders resource uncacheable with reference error": function (done) {
        var group = this.config.addGroup("Some tests", {
            resources: [{ path: "/some.js", content: "buster.ok();" }],
            sources: ["/some.js"]
        });

        var ext = syntax.create();
        ext.analyze(this.analyzer);
        ext.configure(group);

        process(group, done(function (rs) {
            assert.isFalse(rs.resources[0].cacheable);
        }));
    }
});
