var testCase = require("buster-test").testCase;
var referee = require("referee");
var assert = referee.assert;
var refute = referee.refute;
var syntax = require("../lib/syntax");
var jsdom;

try {
    jsdom = require("jsdom");
} catch (e) {}

testCase("Syntax", {
    "passes syntactically valid code": function () {
        assert(syntax.configure().check("var a = 42;").ok);
    },

    "passes syntactically valid code with file name": function () {
        assert(syntax.configure().check("var a = 42;", "booya.js").ok);
    },

    "fails syntactically invalid code": function () {
        var result = syntax.configure().check("va a = 42;");
        refute(result.ok);
        assert.equals(result.errors, [{
            type: syntax.SYNTAX_ERROR,
            file: null,
            line: 1,
            col: 4,
            content: "va a = 42;",
            message: "Unexpected token: name (a)"
        }]);
    },

    "formats syntax error nicely": function () {
        var result = syntax.configure().check("va a = 42;");

        assert.equals(result.errors, [{
            type: syntax.SYNTAX_ERROR,
            file: null,
            line: 1,
            col: 4,
            content: "va a = 42;",
            message: "Unexpected token: name (a)"
        }]);
    },

    "formats syntax error with file name": function () {
        var result = syntax.configure().check("va a = 42;", "omg.js");

        assert.match(result.errors, [{
            file: "omg.js",
            line: 1,
            col: 4
        }]);
    },

    "recognizes browser globals": function () {
        assert(syntax.configure().check("document.createElement('div');").ok);
    },

    "recognizes globals introduced by previously loaded script": function () {
        var checker = syntax.configure();
        checker.check("jQuery = function () {};");
        assert(checker.check("var a = jQuery('div');").ok);
    },

    "when jsdom is available": {
        requiresSupportFor: { "jsdom": typeof jsdom !== "undefined" },

        "does not recognize undefined globals": function () {
            var checker = syntax.configure();
            checker.check("jQuery = function () {};");
            var result = checker.check("var a = $('div');");
            refute(result.ok, JSON.stringify(result));
            assert.equals(result.errors[0].type, syntax.REFERENCE_ERROR);
        }
    },

    "ignores reference errors": function () {
        var checker = syntax.configure({ ignoreReferenceErrors: true });
        var result = checker.check("var a = $('div');");
        assert(result.ok);
    },

    "does not fail on file ending in comment": function () {
        var checker = syntax.configure();
        var result = checker.check("jQuery = function () {};\n// Ok");
        assert(result.ok);

        checker = syntax.configure({ ignoreReferenceErrors: true });
        result = checker.check("jQuery = function () {};\n// Ok");
        assert(result.ok);
    },

    "passes valid code without configuration": function () {
        var result = syntax.check("jQuery = function () {};\n// Ok");
        assert(result.ok);
    },

    "fails invalid code without configuration": function () {
        var result = syntax.check("jQuery = function () {};\n// Ok");
        assert(result.ok);
    }
});
