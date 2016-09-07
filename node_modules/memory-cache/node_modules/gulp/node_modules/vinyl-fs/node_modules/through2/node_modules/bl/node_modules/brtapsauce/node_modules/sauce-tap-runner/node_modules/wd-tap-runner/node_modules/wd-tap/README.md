# wd-tap

[![NPM](https://nodei.co/npm/wd-tap.png?compact=true)](https://nodei.co/npm/wd-tap/)

[![Build Status](https://drone.io/github.com/conradz/wd-tap/status.png)](https://drone.io/github.com/conradz/wd-tap/latest)
[![Dependency Status](https://gemnasium.com/conradz/wd-tap.png)](https://gemnasium.com/conradz/wd-tap)

Run TAP tests in the browser with WebDriver.

This is a simple utility to run [TAP](http://testanything.org/) tests in a
browser that is automated using
[WebDriver](http://docs.seleniumhq.org/projects/webdriver/), driven using
[Node.js](http://nodejs.org/).

## Requirements

You must first have a test page that has a `<pre>` element with an ID of
`output` that will contain the TAP test output. You will also need a web
browser that is automated using WebDriver; you can run one yourself locally or
you could use a service like [Sauce Labs](http://saucelabs.com/) that will run
them for you. For attaching to a WebDriver-automated browser, use
[wd](https://github.com/admc/wd) that allows Node to interface to WebDriver.

The test results are parsed using
[tap-parser](https://github.com/substack/tap-parser).

## Example

This example assumes that you have a WebDriver server running locally, see the
[wd docs](https://github.com/admc/wd) for how to connect to a browser. It also
assumes that you have an HTTP server accessible from the browser serving the
test page at `http://localhost:8000/test.html`.

```js
var wd = require('wd'),
    wdTap = require('wd-tap');

var browser = wd.remote(),
    url = 'http://localhost:8000/test.html';

browser.init(function(err) {
    if (err) { return; }

    wdTap(url, browser, function(err, results) {
        // results is the parsed TAP results
        if (!results.ok) {
            console.log('Tests failed');
        }

        browser.quit();
    });
});
```

## Reference

### `wdTap(url, browser, [options], callback)`

Runs the tests in the browser.

`url` is the URL of the web page that contains the tests. The test TAP output
must be written to a `<pre>` element with an ID of `output`.

`browser` is the browser (connected with [wd](https://github.com/admc/wd)) that
will run the tests. It must be able to access the test URL.

`options` is an optional object that may contain a `timeout` property
specifying the maximum time (in seconds) to wait for the TAP output to be
completed. If the TAP output is not completed in that time, an error will be
passed to `callback`. The default timeout is 30 seconds.

`callback` will be called after the tests are finished. If an error occured
(for example if the connection to the browser was disconnected), it will be
passed to the callback. If no error occurred, the TAP results (parsed with
[tap-parser](https://github.com/substack/tap-parser)) will be passed to the
callback as the second argument. Note that if a test fails, it will not be
considered an error, the results will indicate which tests passed or failed.