var referee = require("referee");
var bt = require("buster-test");

var assertions = 0;
var count = function () { assertions += 1; };

bt.testRunner.onCreate(function (runner) {
    referee.on("pass", runner.assertionPass.bind(runner));

    runner.on("suite:end", function (results) {
        if (!results.ok) {
            setTimeout(function () {
                process.exit(1);
            }, 50);
        }
    });
});

bt.testContext.on("create", bt.autoRun());

require("./test/syntax-test.js");
require("./test/buster-syntax-test.js");
