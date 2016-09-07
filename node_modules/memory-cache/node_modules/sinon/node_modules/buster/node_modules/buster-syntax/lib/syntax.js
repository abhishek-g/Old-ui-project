var vm = require("vm");
var jsp = require("uglify-js").parser;
var jsdom;

try {
    jsdom = require("jsdom").jsdom;
} catch (e) {
    // No worries, jsdom is optional
    jsdom = function () { return {}; };
}

var refErrRegExp = /ReferenceError: (.*) is not defined/;

function getType(error) {
    var s = module.exports;
    return refErrRegExp.test(error) ? s.REFERENCE_ERROR : s.SYNTAX_ERROR;
}

function errorDetails(script) {
    try {
        jsp.parse(script);
        return null;
    } catch (e) {
        return e;
    }
}

function prepareResults(error, script, fileName) {
    if (!error) { return { ok: true, errors: [] }; }
    var e = errorDetails(script) || error;
    var details = {
        file: fileName || null,
        type: getType(error),
        message: e.message
    };
    if (typeof e.line === "number") {
        details.line = e.line;
        details.col = e.col;
        details.content = script.split("\n")[e.line - 1];
    }
    return { ok: false, errors: [details] };
}

function createContext() {
    var markup = "<!DOCTYPE html><html><head></head><body></body></html>";
    var dom = jsdom(markup);

    var context = {
        setTimeout: setTimeout,
        setInterval: setInterval,
        clearTimeout: clearTimeout,
        clearInterval: clearInterval,
        window: dom.createWindow && dom.createWindow()
    };

    if (context.window) {
        var prop;
        for (prop in context.window) {
            context[prop] = context.window[prop];
        }
    }

    return context;
}

module.exports = {
    SYNTAX_ERROR: "Syntax error",
    REFERENCE_ERROR: "ReferenceError",

    configure: function (options) {
        var opt = options || {};
        var checker = Object.create(this);
        checker.context = createContext();

        if (checker.context.window) {
            checker.ignoreReferenceErrors = opt.ignoreReferenceErrors || false;
        } else {
            checker.ignoreReferenceErrors = true;
        }

        return checker;
    },

    check: function (script, file) {
        try {
            var check = script;
            if (this.ignoreReferenceErrors) {
                check = "(function () {" + script + "\n})";
            }
            vm.runInNewContext(check, this.context || createContext);
            return { ok: true };
        } catch (e) {
            return prepareResults(e, script, file);
        }
    }
};
