(function (B) {
	"use strict";

    var runner = B.testRunner.create({
        runtime: navigator.userAgent
    });

    var matches = window.location.href.match(/(\?|&)reporter=([^&]*)/);
    var reporter = B.reporters[B.defaultReporter];

    if (matches && matches[2]) {
        reporter = B.reporters[matches[2]];
    }

    reporter = reporter || B.reporters.html;
    reporter.create({ root: document.body }).listen(runner);
    B.wire(runner);
}(buster));
