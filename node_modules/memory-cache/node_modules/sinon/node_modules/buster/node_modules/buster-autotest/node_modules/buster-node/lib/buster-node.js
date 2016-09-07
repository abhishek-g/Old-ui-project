var referee = require("referee");
var test = require("buster-test");
var formatio = require("formatio");
var sinon = require("sinon");

var stackFilter = require("stack-filter").configure({
    filters: ["buster-node/lib", "buster-node/node_modules"],
    cwd: process.cwd()
});

require("referee-sinon")(referee, sinon);
require("buster-sinon")(sinon, test, stackFilter, formatio);

var formatter = formatio.configure({ quoteStrings: true });
referee.format = formatter.ascii.bind(formatter);

module.exports = {
    referee: referee,
    assert: referee.assert,
    refute: referee.refute,
    expect: referee.expect,
    sinon: sinon
};

// Expose buster test sub modules
for (var exp in test) {
    module.exports[exp] = test[exp];
}

// Configure assertion counting
test.testRunner.onCreate(function (runner) {
    referee.on("pass", function () {
        runner.assertionPass();
    });
});

// Configure automagic runner
var runner = test.autoRun({ stackFilter: stackFilter }, {
    end: function (results) {
        process.exit(results.ok ? 0 : 1);
    }
});

test.testContext.on("create", runner);
