var finished = require('tap-finished');

module.exports = wdTap;

function createParser(callback) {
    var parser = finished(callback),
        received = [];

    parser.update = function(text) {
        text = text || '';
        text = text.replace(/[\r\n]+/g, '\n');
        text = text.trim();
        if (!text) {
            return;
        }

        var lines = text.split(/\r?\n/g),
            i = 0;

        for (; i < lines.length; i++) {
            if (lines[i] !== received[i]) {
                break;
            }
        }

        if (i < lines.length) {
            var newLines = lines.slice(i);
            received = received.concat(newLines);
            parser.write(newLines.join('\r\n') + '\r\n');
        }
    };

    return parser;
}

function wdTap(url, browser, options, callback) {
    var parser = createParser(function(data) { done(null, data); }),
        finished = false,
        timeout = 30,
        cancelTimer = null,
        updateTimer = null;

    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    if (typeof options.timeout === 'number') {
        timeout = options.timeout;
    }

    function cancel() {
        done(new Error('Tests timed out'));
    }

    function update() {
        updateTimer = null;
        if (finished) {
            return;
        }

        browser.elementById('output', function(err, el) {
            if (err) {
                return done(err);
            }

            el.text(function(err, text) {
                if (err) {
                    return done(err);
                }

                parser.update(text);

                if (!finished) {
                    updateTimer = setTimeout(update, 500);
                }
            });
        });
    }

    function done(err, data) {
        if (finished) {
            return;
        }

        finished = true;
        if (cancelTimer !== null) {
            clearTimeout(cancelTimer);
        }
        if (updateTimer !== null) {
            clearTimeout(updateTimer);
        }

        callback(err, data);
    }

    browser.get(url, function(err) {
        if (err) {
            return done(err);
        }

        update();
    });

    cancelTimer = setTimeout(cancel, timeout * 1000);
}
